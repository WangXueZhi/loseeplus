import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";

import "../editor/DisabledEditorPlugin"; // 用于隐藏一些不需要的Editor预置组件
import { inject, observer } from "mobx-react";
import { IMainStore } from "../store";

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

    useEffect(() => {
      
    });


    return (
      <div className="Login">

      </div>
    );
  })
);
