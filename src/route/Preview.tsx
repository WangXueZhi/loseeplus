// 页面预览页
import { useState, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { render } from "amis";
import axios from "axios";

interface IParam {
  id?: string;
}
interface PreviewProps extends RouteComponentProps<IParam> {}

const Preview = (props: PreviewProps) => {
  const { history } = props;
  const { id = undefined } = props.match.params;
  const [pageSchema, setPageSchema] = useState<any>({
    type: "page",
    title: "页面数据丢失",
    mobile: false,
  });

  const frameworkSchema = {
    type: "page",
    body: {
      type: "panel",
      title: "面板标题",
      body: "面板内容",
      affixFooter: true,
      actions: [
        {
          type: "button",
          label: "按钮 1",
          actionType: "dialog",
          dialog: {
            title: "提示",
            body: "对，你刚点击了！",
          },
        },
        {
          type: "button",
          label: "按钮 2",
          actionType: "dialog",
          dialog: {
            title: "提示",
            body: "对，你刚点击了！",
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (id) {
      axios.get(`/api/getBodyById?id=${id}`).then(({ data }) => {
        if (data) {
          setPageSchema(data.schema);
          console.log(pageSchema, data, "page");
        } else {
          setPageSchema({ type: "page", title: "页面未找到", mobile: false });
        }
      });
    } else {
      setPageSchema({ type: "page", title: "页面数据丢失", mobile: false });
    }
  }, []);
  const schema = useMemo(() => {
    return {
      type: "page",
      body: {
        type: "panel",
        title: "预览面板",
        body: pageSchema,
        affixFooter: true,
        actions: [
          {
            label: "去编辑",
            type: "button",
            actionType: "link",
            onClick: () => {
              history.push(`/page-edit/${id}/`);
            },
            level: "primary",
          },
          {
            label: "返回",
            type: "button",
            actionType: "link",
            onClick: () => {
              history.push("/page-manage");
            },
          },
        ],
      },
    };
  }, [pageSchema]);
  return render(schema, {});
};

export default Preview;
