import React, { createContext, useState } from "react";

export const CalendarContext = createContext();

const CalendarProvider = props => {
  const [deadlines, setDeadlines] = useState(null);

  return (
    <CalendarContext.Provider
      value={{
        calendar: [deadlines, setDeadlines]
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
