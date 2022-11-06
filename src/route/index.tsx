import React from "react";
import { ToastComponent, AlertComponent, Spinner } from "amis";
import {
  Route,
  Switch,
  Redirect,
  HashRouter as Router,
} from "react-router-dom";
import { observer } from "mobx-react";
import { IMainStore } from "../store";

const Home = React.lazy(() => import("./Home"));
const Editor = React.lazy(() => import("../component/BEditor"));
const Preview = React.lazy(() => import("./Preview"));
const Login = React.lazy(() => import("../component/Login"));

export default observer(function ({ store }: { store: IMainStore }) {
  store.getList();
  return (
    <Router>
      <div className="routes-wrapper">
        <ToastComponent key="toast" position={"top-right"} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          {/* 列表页做兜底 */}
          <Switch>
            <Redirect to={`/page-manage`} from={`/`} exact />
            <Route path="/page-add" component={Editor} />
            <Route path="/page-preview/:id" component={Preview} />
            <Route path="/page-edit/:id" component={Editor} />
            <Route path="/hello-world" component={Home} />
            <Route path="/login" component={Login} />
            <Route component={Home} />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
});
