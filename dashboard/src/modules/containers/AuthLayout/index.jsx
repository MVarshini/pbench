import "./index.less";

import * as AppRoutes from "utils/routeConstants";
import * as cx from "classnames";

import { Grid, GridItem } from "@patternfly/react-core";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import BackgroundCard from "modules/components/BackgroundComponent";
import Cookies from "js-cookie";
import { LoginRightComponent } from "modules/components/AuthComponent/common-components";
import React from "react";
import ToastComponent from "modules/components/ToastNotificationComponent";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const loggedIn = Cookies.get("isLoggedIn");
  const { alerts } = useSelector((state) => state.toastReducer);

  if (loggedIn) {
    return <Navigate to="/" />;
  }
  const wrapperName = pathname.includes(AppRoutes.AUTH_SIGNUP)
    ? "signup-wrapper"
    : "login-wrapper";
  return (
    <>
      <BackgroundCard>
        <div className={cx("main-container", wrapperName)}>
          {alerts && alerts.length > 0 && <ToastComponent />}
          <Grid gutter="md" className="login-page">
            <GridItem
              sm={8}
              md={4}
              lg={4}
              smOffset={1}
              mdOffset={1}
              lgOffset={1}
              className={"form"}
            >
              <Outlet context={navigate} />
            </GridItem>
            <GridItem
              sm={11}
              md={5}
              lg={5}
              smOffset={9}
              mdOffset={6}
              lgOffset={6}
              className={"sideGrid"}
            >
              <div className="login-right-component">
                <LoginRightComponent />
              </div>
            </GridItem>
          </Grid>
        </div>
      </BackgroundCard>
    </>
  );
};
export default AuthLayout;
