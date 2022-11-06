const path = require("path");
const express = require("express");
// const { createProxyMiddleware } = require('http-proxy-middleware');
const argv = require("minimist")(process.argv.slice(2));
const bodyParser = require("body-parser");
const JSONdb = require("simple-json-db");
const db = new JSONdb("./storage.json", { asyncWrite: true });

const app = express();
console.log(path.join(__dirname + "/build/"));
app.use(
  express.static(path.join(__dirname + "/build/"), {
    maxage: "1h",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// 返回的结果数据格式化
function formatRows(pages) {
  const keys = Object.keys(pages);
  if (keys.length > 0) {
    return keys.map((id) => {
      return { id, title: pages[id].title };
    });
  } else {
    return [];
  }
}

// 新增&修改,id-value的map结构
app.post("/api/save", function (req, res, next) {
  const { body, id = "" } = req.body;
  let pageMap = db.JSON();
  let index = id;
  // 修改
  if (id) {
    if (pageMap[id]) {
      pageMap[id] = body;
      db.JSON(pageMap);
    } else {
      return res.json({
        data: null,
      });
    }
  } else {
    // 新增
    let keys = Object.keys(pageMap).sort((a, b) => {
      return a - b;
    });
    index = keys.length === 0 ? 1 : parseInt(keys[keys.length - 1]) + 1;
    pageMap[`${index}`] = body;
    db.JSON(pageMap);
  }
  db.sync();
  res.json({
    id: index,
  });
});

// 删除
app.post("/api/pageDelete", function (req, res, next) {
  const { id } = req.body;
  let pageMap = db.JSON();
  if (pageMap[id]) {
    delete pageMap[id];
    db.JSON({ ...pageMap });
    db.sync();
    res.json({
      data: null,
    });
  } else {
    res.json({
      data: null,
    });
  }
});

// 查询
app.get("/api/getPageList", function (req, res, next) {
  const { page = 1, perPage = 10, id = "", name = "" } = req.query;
  const pageMap = db.JSON();
  const commonParams = {
    perPage: parseInt(perPage),
    page: parseInt(page),
  };

  if (Object.keys(pageMap).length === 0) {
    // 数据为空
    return res.json({
      rows: [],
      total: 0,
      totalPage: 1,
      ...commonParams,
    });
  } else {
    // 精确查询
    const result = {};
    if (id) {
      result[id] = pageMap[id];
      // id 和 name同时所谓筛选条件时
      if (name) {
        return res.json({
          rows: result.title.search(name) !== -1 ? formatRows(result) : [],
          total: 1,
          totalPage: 1,
          ...commonParams,
        });
      } else {
        return res.json({
          rows: formatRows(result),
          total: 0,
          totalPage: 1,
          ...commonParams,
        });
      }
    } else {
      const keys = Object.keys(pageMap);
      const values = Object.values(pageMap);
      if (name) {
        keys.forEach((item, index) => {
          if (values[index].title.search(name) !== -1) {
            result[item] = values[index];
          }
        });
        return res.json({
          total: result.length,
          rows: formatRows(result),
          totalPage: Math.ceil(Object.keys(result).length / perPage),
          ...commonParams,
        });
      } else {
        // 查询条件为空，返回全量数据
        return res.json({
          total: keys.length,
          rows: formatRows(pageMap),
          totalPage: Math.ceil(Object.keys(pageMap).length / perPage),
          ...commonParams,
        });
      }
    }
  }
});

app.get("/api/getBodyById", function (req, res, next) {
  const { id = "" } = req.query;
  const pageMap = db.JSON();
  if (pageMap[id]) {
    res.json({
      schema: pageMap[id],
    });
  } else {
    res.json({
      schema: null,
    });
  }
});

app.listen(80, "0.0.0.0", () => {
  console.log("http://0.0.0.0");
});
