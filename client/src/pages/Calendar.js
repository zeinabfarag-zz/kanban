import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container } from "@material-ui/core";
import Navbar from "./Navbar";
import { authFetch, getCurrentBoard } from "../AuthService";
import { CalendarContext } from "../calendarContext";
import moment from "moment";
import { handleError } from "../utils/handleAlerts";

const Calendar = props => {
  const { calendar } = useContext(CalendarContext);
  let [deadlines, setDeadlines] = calendar;

  let dashboardId = getCurrentBoard();

  useEffect(() => {
    authFetch(`/calendar/${dashboardId}`)
      .then(res => {
        setDeadlines(res);
      })
      .catch(() => setDeadlines([]));
  }, [dashboardId]);

  const eventDrop = info => {
    const columnId = info.event.extendedProps.column;
    const task = info.event.extendedProps.task;

    const card = {
      deadline: moment(info.event.start).format("YYYY-MM-DD"),
      title: info.event.title,
      tag: info.event.extendedProps.tag,
      description: info.event.extendedProps.description,
      attachment: info.event.extendedProps.attachment
    };

    authFetch(`/calendar/${dashboardId}/columns/${columnId}/tasks/${task}`, {
      method: "PUT",
      body: JSON.stringify(card)
    }).catch(err => {
      handleError(err);
    });

    authFetch(`/dashboards/${dashboardId}/columns/${columnId}/tasks/${task}`, {
      method: "PUT",
      body: JSON.stringify(card)
    }).catch(err => {
      handleError(err);
    });
  };

  const eventClick = info => {
    const columnId = info.event.extendedProps.column;
    const task = info.event.extendedProps.task;

    props.history.push(
      `/calendar/${dashboardId}/columns/${columnId}/tasks/${task}`
    );
  };

  return (
    <div>
      <Navbar />
      <Container>
        <FullCalendar
          defaultView="dayGridMonth"
          height={550}
          header={{
            left: "",
            center: "title",
            right: "prev,next"
          }}
          events={deadlines}
          editable={true}
          eventBackgroundColor="white"
          eventTextColor="black"
          eventDrop={info => eventDrop(info)}
          eventClick={info => eventClick(info)}
          plugins={[dayGridPlugin, interactionPlugin]}
          fixedWeekCount={false}
        />
      </Container>
    </div>
  );
};

export default Calendar;
