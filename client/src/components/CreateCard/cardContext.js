import React, { createContext, useState, useContext } from "react";
import moment from "moment";
import { authFetch, getCurrentBoard } from "../../AuthService";
import { UserContext } from "../../userContext";
import { handleError, handleSuccess } from "../../utils/handleAlerts";
import { CalendarContext } from "../../calendarContext";

const CardContext = createContext();

const CardProvider = props => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openCard, setOpenCard] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);
  const [tag, setTag] = useState("");
  const [deadline, setDeadline] = useState("");
  const [columnName, setColumnName] = useState("");
  const [error, setError] = useState("");
  const [task, setTask] = useState("");
  const [columnId, setColumnId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [file, setFile] = useState([]);

  let dashboardId = getCurrentBoard();

  //get dashboard values from user context
  const { value1 } = useContext(UserContext);
  let [dashboard, setDashboard] = value1;

  const { calendar } = useContext(CalendarContext);
  const [, setDeadlines] = calendar;

  const handleCurrentTask = (taskId, columnId, hist) => {
    const columnName = dashboard.columns[columnId].title;
    if (!taskId) {
      setTitle("");
      setDescription("");
      setDeadline("");
      setAttachment([]);
      setTag("");
      setTask("");
      handleOpenCard();
    }
    if (taskId) {
      setTask(taskId);
      fetchCard(taskId, columnId, dashboard);
    }
    routeChange(taskId, columnId, dashboardId, hist);
    setColumnId(columnId);
    setColumnName(columnName);
  };

  const routeChange = (taskId, columnId, dashboardId, hist) => {
    if (!taskId) {
      hist.push(`/dashboards/${dashboardId}`);
    } else {
      let path = `/dashboards/${dashboardId}/columns/${columnId}/tasks/${taskId}`;
      hist.push(path);
    }
  };

  const fetchCard = (taskId, columnId, dashboard) => {
    const task = dashboard.columns[columnId].tasks[taskId];
    const columnName = dashboard.columns[columnId].title;
    if (task) {
      handleOpenCard();
      setTask(taskId);
      setTitle(task.title);
      setDescription(task.description);
      setTag(task.tag);
      setDeadline(task.deadline);
      setAttachment(task.attachment);
      setColumnName(columnName);
      setColumnId(columnId);
      task.deadline && setOpenDeadline(true);
    }
  };

  const handleSubmit = () => {
    if (!title) {
      setError(true);
    } else {
      if (!task) {
        const createTask = {
          deadline,
          title,
          description,
          tag,
          attachment
        };

        const postCard = () => {
          authFetch(`/dashboards/${dashboardId}/columns/${columnId}/tasks`, {
            method: "POST",
            body: JSON.stringify(createTask)
          })
            .then(res => {
              updateUser(res);
            })
            .then(() => handleCloseCard())
            .then(() => handleSuccess(`${title} has been saved!`))
            .catch(err => {
              handleError(err);
            });
        };

        if (file instanceof FormData) {
          fetch("/file/url", {
            method: "POST",
            body: file
          })
            .then(response => response.json())
            .then(data => {
              const fileData = [{ url: data.url, name: data.name }];
              createTask.attachment = fileData;
            })
            .then(() => postCard());
        } else {
          postCard();
        }
      } else {
        const updatedTask = {
          deadline,
          title,
          description,
          tag,
          attachment
        };

        const updateCard = () => {
          if (deadline) {
            authFetch(
              `/calendar/${dashboardId}/columns/${columnId}/tasks/${task}`,
              {
                method: "PUT",
                body: JSON.stringify(updatedTask)
              }
            )
              .then(res => setDeadlines(res))
              .catch(err => {
                handleError(err);
              });
          }

          authFetch(
            `/dashboards/${dashboardId}/columns/${columnId}/tasks/${task}`,
            {
              method: "PUT",
              body: JSON.stringify(updatedTask)
            }
          )
            .then(res => updateUser(res))
            .then(() => handleCloseCard())
            .then(() => handleSuccess(`${title} has been updated!`))
            .catch(err => {
              handleError(err);
            });
        };

        if (file instanceof FormData) {
          fetch("/file/url", {
            method: "POST",
            body: file
          })
            .then(response => response.json())
            .then(data => {
              const fileData = [{ url: data.url, name: data.name }];
              updatedTask.attachment = fileData;
            })
            .then(() => updateCard());
        } else {
          updateCard();
        }
      }
    }
  };

  const updateUser = res => {
    setDashboard(res.result);
  };

  const handleOpenCard = () => {
    setOpenCard(true);
  };

  const handleCloseCard = () => {
    setOpenCard(false);
    setOpenTag(false);
    setOpenDeadline(false);
    setOpenAttachment(false);
    setFile(null);
    setOpenDelete(false);
    setError(false);
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleOpenTag = () => {
    setOpenTag(true);
  };

  const handleTagChange = color => {
    setTag(color);
    setOpenTag(false);
  };

  const handleDeadlineChange = date => {
    if (!date) {
      setDeadline(moment().format("YYYY-MM-DD"));
    } else {
      setDeadline(moment(date).format("YYYY-MM-DD"));
    }
  };

  const handleOpenDeadline = () => {
    if (!deadline) {
      setDeadline(moment().format("YYYY-MM-DD"));
    }
    setOpenDeadline(true);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleAttachmentChange = event => {
    const data = new FormData();
    data.append("file", event.target.files[0]);
    setAttachment([]);
    setFile(data);
  };

  const handleOpenAttachment = () => {
    setOpenAttachment(true);
  };

  const handleDelete = (calendarView, hist) => {
    authFetch(`/dashboards/${dashboardId}/columns/${columnId}/tasks/${task}`, {
      method: "DELETE"
    })
      .then(res => updateUser(res))
      .then(
        calendarView
          ? hist.push(`/calendar/${dashboardId}`)
          : hist.push(`/dashboards/${dashboardId}`)
      )
      .then(() => handleCloseCard())
      .then(() => handleSuccess(`Task has been deleted`))
      .catch(err => {
        handleError(err);
      });

    if (deadline) {
      authFetch(`/calendar/${dashboardId}/tasks/${task}`, {
        method: "DELETE"
      })
        .then(res => setDeadlines(res))
        .then(
          calendarView
            ? hist.push(`/calendar/${dashboardId}`)
            : hist.push(`/dashboards/${dashboardId}`)
        )
        .catch(err => {
          handleError(err);
        });
    }
  };

  return (
    <CardContext.Provider
      value={{
        title,
        task,
        handleTitleChange,
        handleCurrentTask,
        handleCloseCard,
        openCard,
        error,
        handleOpenCard,
        columnName,
        description,
        handleSubmit,
        handleDescriptionChange,
        tag,
        openTag,
        handleOpenTag,
        handleTagChange,
        deadline,
        handleDeadlineChange,
        handleOpenDeadline,
        openDeadline,
        fetchCard,
        handleOpenDelete,
        handleCloseDelete,
        handleDelete,
        openDelete,
        handleOpenAttachment,
        openAttachment,
        attachment,
        handleAttachmentChange
      }}
    >
      {props.children}
    </CardContext.Provider>
  );
};

export { CardProvider, CardContext };
