// 平台基础页面搭建
const pageJson = [
  // 页面管理一级目录
  {
    pageManage: {
      type: "page",
      title: "页面管理",
      body: [
        {
          type: "crud",
          name: "pageListTable",
          syncLocation: false,
          filter: {
            body: [
              {
                type: "input-text",
                label: "ID",
                name: "id",
                id: "u:f6a277c0a497",
                mode: "inline",
                size: "sm",
              },
              {
                type: "input-text",
                label: "页面名称",
                name: "name",
                id: "u:3e423b217303",
                size: "sm",
                mode: "inline",
              },
            ],
          },
          api: {
            method: "get",
            url: "/api/getPageList",
          },
          columns: [
            {
              name: "id",
              label: "ID",
              type: "text",
              id: "u:1334f76cfe27",
            },
            {
              name: "title",
              label: "页面名称",
              type: "text",
              id: "u:735902d5f705",
              placeholder: "-",
            },
            {
              type: "operation",
              label: "操作",
              buttons: [
                {
                  type: "button",
                  label: "删除",
                  actionType: "ajax",
                  level: "link",
                  className: "text-danger",
                  confirmText: "确定要删除？",
                  api: {
                    method: "post",
                    url: "/api/pageDelete",
                  },
                  id: "u:783f94a20e36",
                },
                {
                  label: "编辑",
                  type: "button",
                  actionType: "link",
                  link: "/page-edit/${id}",
                  level: "link",
                  id: "u:3119b05ff8c1",
                },
                {
                  label: "预览",
                  type: "button",
                  actionType: "link",
                  link: "/page-preview/${id}",
                  level: "link",
                  id: "u:7f282a584618",
                },
              ],
              id: "u:4fd9a6821b66",
            },
          ],
          bulkActions: [],
          itemActions: [],
          features: ["create", "filter", "delete", "update", "view"],
          filterColumnCount: 3,
          headerToolbar: [
            {
              label: "新增",
              type: "button",
              actionType: "link",
              link: "/page-add",
              level: "primary",
              id: "u:2e8737d1e7b4",
            },
            "bulkActions",
          ],
          id: "u:9d341f6ec061",
        },
      ],
      id: "u:6a52978bcf48",
      messages: {},
      pullRefresh: {},
    },
  },
];
export default pageJson;
