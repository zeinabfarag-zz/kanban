import { handleError } from "./handleAlerts";
import { authFetch } from "../AuthService";

//ToDo remove this after implementing create board function
export const updateTaskIndexInColumn = async (
  dashboardId,
  columnId,
  taskOrder
) => {
  let body = { taskOrder };
  authFetch(`/dashboards/${dashboardId}/columns/${columnId}/taskOrder`, {
    method: "PUT",
    body: JSON.stringify(body)
  }).catch(err => handleError(err));
};

export const moveTasksToOther = async (dashboardId, newStart, newFinish) => {
  const columnId = newStart._id;

  let body = {
    columnSourceTasks: newStart.tasks,
    columnSourceTaskOrder: newStart.taskOrder,
    columnToSourceId: newFinish._id,
    columnToTasks: newFinish.tasks,
    columnToTaskOrder: newFinish.taskOrder
  };
  authFetch(`/dashboards/${dashboardId}/columns/${columnId}/taskColumnOrder`, {
    method: "PUT",
    body: JSON.stringify(body)
  }).catch(err => handleError(err));
};

export const updateColumnIndex = (dashboardId, columnOrder, columnId) => {
  let body = {
    columnOrder
  };

  authFetch(`/dashboards/${dashboardId}/columns/${columnId}/columnOrder`, {
    method: "PUT",
    body: JSON.stringify(body)
  }).catch(err => handleError(err));
};

//done
export const addColumn = (dashboardId, title, position, cb) => {
  let body = {
    title,
    position
  };

  authFetch(`/dashboards/${dashboardId}/columns`, {
    method: "POST",
    body: JSON.stringify(body)
  })
    .then(res => {
      cb(res.result);
    })
    .catch(err => {
      handleError(err);
      return null;
    });
};

export const addDashboard = (title, cb) => {
  let body = {
    title
  };

  authFetch("/dashboards", {
    method: "POST",
    body: JSON.stringify(body)
  })
    .then(res => {
      cb(res.result);
    })
    .catch(err => {
      handleError(err);
    });
};

export const getDashboard = (dashboardId, cb) => {
  authFetch(`/dashboards/${dashboardId}`).then(res => {
    cb(res.result);
  });
};

export const getDashboardTitles = cb => {
  authFetch("/dashboards").then(res => {
    cb(res.result);
  });
};

export const deleteColumn = (dashboardId, columnId, cb) => {
  authFetch(`/dashboards/${dashboardId}/columns/${columnId}`, {
    method: "DELETE"
  })
    .then(res => {
      cb(res.result);
    })
    .catch(err => {
      handleError(err);
    });
};

export const updateColumnName = (dashboardId, columnId, title, cb) => {
  let body = {
    title
  };
  authFetch(`/dashboards/${dashboardId}/columns/${columnId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  })
    .then(res => {
      cb(res.result);
    })
    .catch(err => {
      handleError(err);
    });
};
