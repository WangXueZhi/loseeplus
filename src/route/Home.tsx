import React from "react";
import { observer, inject } from "mobx-react";
import { IMainStore } from "../store";
import { AsideNav, Layout, confirm } from "amis";
import { RouteComponentProps, matchPath, Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";
import AMISRenderer from "../component/AMISRenderer";
import AddPageModal from "../component/AddPageModal";

function isActive(link: any, location: any) {
  const ret = matchPath(location.pathname, {
    path: link ? link.replace(/\?.*$/, "") : "",
    exact: true,
    strict: true,
  });

  return !!ret;
}

export default inject("store")(
  observer(function ({
    store,
    location,
    history,
  }: { store: IMainStore } & RouteComponentProps) {
    // header内容的渲染
    function renderHeader() {
      return (
        <div>
          <div className={`a-Layout-headerBar`}>
            <div
              className="hidden-xs pull-right px-2 w-full"
              style={{
                background: "black",
                height: "50px",
                color: "white",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "50px",
                textAlign: "center",
              }}
            >
              loseeplus
              {/* <Button
                size="sm"
                level="info"
                onClick={() => store.setAddPageIsOpen(true)}
              >
                新增页面
              </Button> */}
            </div>
          </div>
        </div>
      );
    }
    // 侧边内容的渲染
    function renderAside() {
      const navigations = store.pages.map((item) => ({
        label: item.label,
        path: `/${item.path}`,
        icon: item.icon,
      }));
      const paths = navigations.map((item) => item.path);

      const tpls = store.tpls.map((item) => ({
        label: item.label,
        path: `/${item.path}`,
        icon: item.icon,
        type: 'tpl',
        item: item
      }));

      return (
        <AsideNav
          key={store.asideFolded ? "folded-aside" : "aside"}
          navigations={[
            {
              label: "页面管理",
              children: navigations,
            },
            {
              label: "模板管理",
              children: tpls,
            },
          ]}
          renderLink={({ link, toggleExpand, classnames: cx, depth }: any) => {
            if (link.hidden) {
              return null;
            }

            let menuItemLeftchildren = [];

            if (link.children) {
              menuItemLeftchildren.push(
                <span
                  key="expand-toggle"
                  className={cx("AsideNav-itemArrow")}
                  onClick={(e) => toggleExpand(link, e)}
                ></span>
              );
            }

            link.badge &&
              menuItemLeftchildren.push(
                <b
                  key="badge"
                  className={cx(
                    `AsideNav-itemBadge`,
                    link.badgeClassName || "bg-info"
                  )}
                >
                  {link.badge}
                </b>
              );

            if (link.icon) {
              menuItemLeftchildren.push(
                <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
              );
            } else if (store.asideFolded && depth === 1) {
              menuItemLeftchildren.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? "fa fa-folder" : "fa fa-info"
                  )}
                />
              );
            }

            // link.active ||
            //   children.push(
            //     <i
            //       key="delete"
            //       data-tooltip="删除"
            //       data-position="bottom"
            //       className={"navbtn fa fa-times"}
            //       onClick={(e: React.MouseEvent) => {
            //         e.preventDefault();
            //         confirm("确认要删除").then((confirmed) => {
            //           confirmed && store.removePageAt(paths.indexOf(link.path));
            //         });
            //       }}
            //     />
            //   );

            // children.push(
            //   <i
            //     key="edit"
            //     data-tooltip="编辑"
            //     data-position="bottom"
            //     className={"navbtn fa fa-pencil"}
            //     onClick={(e: React.MouseEvent) => {
            //       e.preventDefault();
            //       // history.push(`/edit/${paths.indexOf(link.path)}`);
            //     }}
            //   />
            // );


            menuItemLeftchildren.push(
              <span key="label" className={cx("AsideNav-itemLabel")}>
                {link.label}
              </span>
            );

            let menuItemRight = null
            if (link.type === 'tpl') {
              menuItemRight = <i
                key="create"
                data-tooltip="以此新建"
                data-position="bottom"
                className={"navbtn fa fa-plus"}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  console.log(link)
                  store.updateSchema(link.item.schema)
                  // store.setAddPageIsOpen(true, link.item)
                  history.push(`/page-add`);
                }}
              />
            }

            const menuItemLeft = <div style={{
              display: "flex",
              alignItems: 'center'
            }}>
              {menuItemLeftchildren}
            </div>

            const menuItem = [menuItemLeft, menuItemRight]

            const menuItemStyle = {
              display: "flex",
              alignItems: 'center',
              justifyContent: 'space-between'
            }
            return link.path ? (
              link.active ? (
                <a style={menuItemStyle}>{menuItem}</a>
              ) : (
                <Link style={menuItemStyle} to={link.path[0] === "/" ? link.path : `${link.path}`}>
                  {menuItem}
                </Link>
              )
            ) : (
              <a
                onClick={
                  link.onClick
                    ? link.onClick
                    : link.children
                      ? () => toggleExpand(link)
                      : undefined
                }
                style={menuItemStyle}
              >
                {menuItem}
              </a>
            );
          }}
          isActive={(link: any) =>
            isActive(
              link.path && link.path[0] === "/" ? link.path : `${link.path}`,
              location
            )
          }
        />
      );
    }

    // 确定框的渲染
    function handleConfirm(value: {
      label: string;
      icon: string;
      path: string;
    }) {
      store.addPage({
        ...value,
        schema: {
          type: "page",
          title: value.label,
          body: "这是你刚刚新增的页面。",
        },
      });
      store.setAddPageIsOpen(false);
    }

    return (
      <Layout
        aside={renderAside()}
        header={renderHeader()}
        folded={store.asideFolded}
        offScreen={store.offScreen}
      >
        <Switch>
          {store.pages.map((item) => (
            <Route
              key={item.id}
              path={`/${item.path}`}
              render={() => <AMISRenderer schema={item.schema} />}
            />
          ))}
          {store.tpls.map((item) => (
            <Route
              key={item.id}
              path={`/${item.path}`}
              render={() => <AMISRenderer schema={item.schema} />}
            />
          ))}
          <Route component={NotFound} />
        </Switch>
        <AddPageModal
          show={store.addPageIsOpen}
          onClose={() => store.setAddPageIsOpen(false)}
          onConfirm={handleConfirm}
          pages={store.pages.concat()}
        />
      </Layout>
    );
  })
);
