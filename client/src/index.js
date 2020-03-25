import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserProvider from "./userContext";
import { CardProvider } from "./components/CreateCard/cardContext";
import CalendarProvider from "./calendarContext";

ReactDOM.render(
  <UserProvider>
    <CalendarProvider>
      <CardProvider>
        <App />
      </CardProvider>
    </CalendarProvider>
  </UserProvider>,
  document.getElementById("root")
);
