const schema = {
  "type": "page",
  "id": "u:cf42ac52077b",
  "title": "带查询表单的数据表格模板",
  "body": [
    {
      "type": "alert",
      "body": [
        {
          "type": "tpl",
          "tpl": "<div>\n<div>带查询表单的数据表格模板，包括：查询表单，数据表格，下拉选项动态数据，下载上传，弹窗</div>\n</div>",
          "inline": false,
          "id": "u:bb99dab586bc"
        }
      ],
      "level": "info",
      "id": "u:44129fc8b812",
      "title": "模板说明"
    },
    {
      "type": "crud",
      "id": "u:ec6a798accd8",
      "syncLocation": false,
      "api": {
        "method": "post",
        "url": "",
        "dataType": "json",
        "data": {
          "currentPage": "${page}",
          "pageSize": "${perPage}",
          "&": "$$"
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "type": "text",
          "id": "u:c7933db17841"
        },
        {
          "type": "mapping",
          "label": "用户类型",
          "name": "userType",
          "id": "u:acb108713d37",
          "map": {
            "0": "普通用户",
            "1": "机构用户",
            "2": "平台用户",
            "10": "商户"
          }
        },
        {
          "type": "text",
          "label": "数量",
          "name": "quantity",
          "id": "u:f3f52ac72f62"
        },
        {
          "type": "text",
          "label": "创建时间",
          "name": "createTime",
          "id": "u:cedd82eaa7f7"
        },
        {
          "type": "mapping",
          "label": "状态",
          "name": "status",
          "id": "u:3753f9e7411b",
          "map": {
            "1": "成功",
            "2": "失败"
          }
        },
        {
          "type": "operation",
          "label": "操作",
          "buttons": [
            {
              "label": "下载",
              "type": "button",
              "actionType": "dialog",
              "level": "link",
              "dialog": {
                "type": "dialog",
                "title": "下载",
                "body": [
                  {
                    "type": "tpl",
                    "tpl": "<p>确认是否下载</p>",
                    "inline": false,
                    "id": "u:08ed6ebca946"
                  }
                ],
                "id": "u:e6509343db32",
                "closeOnEsc": false,
                "closeOnOutside": false,
                "showCloseButton": true,
                "actions": [
                  {
                    "type": "button",
                    "actionType": "ajax",
                    "label": "下载",
                    "primary": true,
                    "id": "u:5ba0683423dd",
                    "close": true,
                    "onEvent": {
                      "click": {
                        "actions": [
                          {
                            "args": {
                              "api": {
                                "url": "",
                                "method": "post",
                                "dataType": "json",
                                "responseType": "arraybuffer",
                                "data": {
                                  "auditId": "${id}"
                                }
                              },
                              "messages": {
                              }
                            },
                            "actionType": "ajax"
                          }
                        ],
                        "weight": 0
                      }
                    }
                  }
                ]
              },
              "id": "u:6bac5d3a1fa8"
            },
          ],
          "id": "u:2f0014e9c673"
        }
      ],
      "features": [
        "filter",
        "view",
        "delete",
        "update"
      ],
      "filterColumnCount": 3,
      "perPageAvailable": [
        10
      ],
      "syncResponse2Query": false,
      "filter": null,
      "autoGenerateFilter": true,
      "headerToolbar": [
        {
          "type": "button",
          "label": "批量设置",
          "actionType": "dialog",
          "dialog": {
            "title": "批量设置",
            "body": [
              {
                "type": "form",
                "api": {
                  "method": "post",
                  "url": ""
                },
                "body": [
                  {
                    "type": "input-file",
                    "label": "导入文件",
                    "name": "file",
                    "id": "u:c515065ab284",
                    "btnLabel": "文件上传",
                    "multiple": false,
                    "submitType": "asForm",
                    "uploadType": "fileReceptor",
                    "proxy": false,
                    "drag": false,
                    "autoUpload": true,
                    "useChunk": false,
                    "asBlob": true,
                    "formType": "asBlob"
                  }
                ],
                "id": "u:82d2dbe8a9da"
              }
            ],
            "type": "dialog",
            "id": "u:5e74ef824b2b",
            "closeOnEsc": false,
            "closeOnOutside": false,
            "showCloseButton": true,
            "actions": [
              {
                "type": "submit",
                "actionType": "confirm",
                "label": "修正",
                "primary": true,
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "componentId": "u:82d2dbe8a9da",
                        "args": {
                          "value": {
                            "collectibleItem": ""
                          }
                        },
                        "actionType": "setValue"
                      }
                    ],
                    "weight": 0
                  }
                }
              }
            ]
          },
          "id": "u:41bd883b7ac1",
          "disabled": false
        },
      ]
    }
  ],
  "regions": [
    "body"
  ],
  "messages": {
  },
  "pullRefresh": {
  }
}
export default schema