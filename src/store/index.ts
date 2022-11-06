import { types, getEnv } from "mobx-state-tree";
import { PageStore } from "./Page";
import { TplStore, ITplStore } from "./Tpl";
import { reaction } from "mobx";
import basePage from "./basePage";
import axios from "axios";
import tplHelloWorld from '../tpls/query-table'
let pagIndex = 1;
// 声明MST树，并初始化节点
export const MainStore = types
  .model("MainStore", {
    pages: types.optional(types.array(PageStore), [
      {
        id: "1",
        path: "page-manage",
        label: "页面管理",
        icon: "fa fa-file",
        schema: basePage[0].pageManage,
      }
    ]),
    tpls: types.optional(types.array(TplStore), [
      {
        id: `tpl-0`,
        path: "query-table",
        label: "查询数据表格",
        icon: "fa fa-file",
        schema: tplHelloWorld,
      },
    ]),
    theme: "antd",
    asideFixed: true,
    asideFolded: false,
    offScreen: false,
    addPageIsOpen: false,
    preview: false,
    isMobile: false,
    schema: types.frozen(),
    createByItem: types.frozen(),
  })
  // 进行数据的过滤和二次处理
  .views((self) => ({
    get fetcher() {
      return getEnv(self).fetcher;
    },
    get notify() {
      return getEnv(self).notify;
    },
    get alert() {
      return getEnv(self).alert;
    },
    get copy() {
      return getEnv(self).copy;
    },
  }))
  // 声明修改数据的方法
  .actions((self) => {
    function toggleAsideFolded() {
      self.asideFolded = !self.asideFolded;
    }

    function toggleAsideFixed() {
      self.asideFixed = !self.asideFixed;
    }

    function toggleOffScreen() {
      self.offScreen = !self.offScreen;
    }

    function setAddPageIsOpen(isOpened: boolean, createByItem?: any) {
      self.addPageIsOpen = isOpened;
      console.log(createByItem);
      self.createByItem = createByItem;
    }

    function getList() {
      axios.get("/api/getPageList");
    }

    function addPage(data: {
      label: string;
      path: string;
      icon?: string;
      schema?: any;
    }) {
      self.pages.push(
        PageStore.create({
          ...data,
          id: `${++pagIndex}`,
        })
      );
    }

    function removePageAt(index: number) {
      self.pages.splice(index, 1);
    }

    //新增和修改
    function updatePageSchemaAt(index: number) {
      console.log(self.pages[index]);
      self.pages[index].updateSchema(self.schema);
      axios.post("/api/save", {
        body: self.pages[index],
        id: self.pages[index].id,
      });
    }

    function updateSchema(value: any) {
      console.log("updateSchema", value);
      self.schema = value;
    }

    function setPreview(value: boolean) {
      self.preview = value;
    }

    function setIsMobile(value: boolean) {
      self.isMobile = value;
    }

    return {
      getList,
      toggleAsideFolded,
      toggleAsideFixed,
      toggleOffScreen,
      setAddPageIsOpen,
      addPage,
      removePageAt,
      updatePageSchemaAt,
      updateSchema,
      setPreview,
      setIsMobile,
      afterCreate() {
        // persist store
        if (typeof window !== "undefined" && window.localStorage) {
          // 页面数据不存store
          // const storeData = window.localStorage.getItem("store");
          // if (storeData) applySnapshot(self, JSON.parse(storeData));
          // reaction(
          //   () => getSnapshot(self),
          //   (json) => {
          //     window.localStorage.setItem("store", JSON.stringify(json));
          //   }
          // );
        }
      },
    };
  });

export type IMainStore = typeof MainStore.Type;
