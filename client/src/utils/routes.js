import React from "react";
import { Route } from "react-router-dom";
import { loggedIn } from "../AuthService";

const PrivateRoute = ({ component: Component, render: Render = null, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      loggedIn() ? (
        Render ? (
          Render(props)
        ) : Component ? (
          <Component {...props} />
        ) : null
      ) : (
        props.history.replace({
          pathname: "/signin",
          search: `?toRedirect=${props.location.pathname}`,
          state: { from: props.location }
        })
      )
    }
  />
);

export default PrivateRoute;
