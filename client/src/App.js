import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import DashBoard from "./pages/DashBoard";
import Calendar from "./pages/Calendar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./utils/routes";
import CardModal from "./components/CreateCard/Modal";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <PrivateRoute path='/dashboards/:dashboardId' component={DashBoard} />
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
        <PrivateRoute
          path='/(dashboards|calendar)/:dashboardId/columns/:columnId/tasks/:taskId'
          render={props => <CardModal {...props} />}
        />
        <Route path='/calendar/:dashboardId' component={Calendar} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
