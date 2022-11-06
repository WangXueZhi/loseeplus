import React, { useState, useEffect, useRef } from "react";
import { Editor } from "amis-editor"; // ShortcutKey  <ShortcutKey />
import { RouteComponentProps } from "react-router-dom";
import { toast } from "amis";
import axios from "axios";
import "../editor/DisabledEditorPlugin"; // 用于隐藏一些不需要的Editor预置组件
import { inject, observer } from "mobx-react";
import { IMainStore } from "../store";

let host = `${window.location.protocol}//${window.location.host}`;
let iframeUrl = "/editor.html";

// 如果在 gh-pages 里面
if (/^\/amis-editor-demo/.test(window.location.pathname)) {
  host += "/amis-editor";
  iframeUrl = "/amis-editor-demo" + iframeUrl;
}
const schemaUrl = `${host}/schema.json`;

interface IParam {
  id?: string;
}
interface BEditorProps extends RouteComponentProps<IParam> { }

// const BEditor = (props: BEditorProps) => {

// };

export default inject("store")(
  observer(function ({
    store,
    location,
    history,
    match,
  }: { store: IMainStore } & RouteComponentProps<IParam>) {
    const { id = undefined } = match.params;
    const idRef = useRef(id);
    const [pageSchema, setPageSchema] = useState<any>();
    const [isMobile, setIsMobile] = useState(false);
    const [preview, setPreview] = useState(false);
    useEffect(() => {
      if (idRef.current) {
        axios.get(`/api/getBodyById?id=${idRef.current}`).then(({ data }) => {
          if (data) {
            setPageSchema(data.schema);
            console.log(pageSchema, data, "page");
          }
        });
      } else if(store.schema) {
        setPageSchema(store.schema);
      } else {
        setPageSchema({ type: "page", title: "请搭建你的页面", body: "" });
      }
    }, [idRef.current]);

    function save() {
      // 新增
      console.log(idRef.current);
      if (!idRef.current) {
        axios
          .post("/api/save", {
            body: pageSchema,
          })
          .then((res) => {
            idRef.current = res.data.id;
          });
      } else {
        // 修改
        axios
          .post("/api/save", {
            body: pageSchema,
            id: idRef.current,
          })
          .then((res) => { });
      }
      toast.success("保存成功", "提示");
    }

    function exit() {
      history.push("/page-manage");
    }

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">amis 可视化编辑器</div>
          <div className="Editor-view-mode-group-container">
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn ${!isMobile ? "is-active" : ""}`}
                onClick={() => {
                  setIsMobile(false);
                }}
              >
                PC
              </div>
              <div
                className={`Editor-view-mode-btn ${isMobile ? "is-active" : ""}`}
                onClick={() => {
                  setIsMobile(true);
                }}
              >
                H5
              </div>
            </div>
          </div>

          <div className="Editor-header-actions">
            <div
              className={`header-action-btn margin-left-space ${preview ? "primary" : ""
                }`}
              onClick={() => {
                setPreview(!preview);
              }}
            >
              {preview ? "编辑" : "预览"}
            </div>
            {!preview && (
              <div className={`header-action-btn exit-btn`} onClick={exit}>
                退出
              </div>
            )}
            {!preview && (
              <div className={`header-action-btn preview-btn`} onClick={save}>
                保存
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            theme={"antd"}
            preview={preview}
            isMobile={isMobile}
            value={pageSchema}
            onChange={setPageSchema}
            onPreview={() => {
              setPreview(true);
            }}
            onSave={save}
            className="is-fixed"
            $schemaUrl={schemaUrl}
            iframeUrl={iframeUrl}
            showCustomRenderersPanel={true}
          />
        </div>
      </div>
    );
  })
);
