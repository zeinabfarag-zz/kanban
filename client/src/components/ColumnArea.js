import React, { useContext, useEffect, useState } from "react";
import Column from "./Column";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../userContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { setCurrentBoard, getCurrentBoard } from "../AuthService";
import { withRouter } from "react-router";
import { getDashboard, getDashboardTitles } from "../utils/handleUpdateTasks";

import {
  updateTaskIndexInColumn,
  moveTasksToOther,
  updateColumnIndex
} from "../utils/handleUpdateTasks";

//Component
import CreateColumnButton from "../components/CreateColumnButton";
import CreateBoardColumn from "./TitleInputModal";

const ColumnArea = props => {
  const classes = useStyles(props);
  const { value1, dashboardTitles } = useContext(UserContext);
  let [taskState, setTaskState] = value1;
  let [dbTitles, setdbTitles] = dashboardTitles;
  const [open, setOpen] = useState(false);
  let dashboardId = (taskState && taskState._id) || props.match.params.dashboardId;

  useEffect(() => {
    if (Object.entries(dbTitles).length === 0 && dashboardId === "createboard") {
      setOpen(true);
      return;
    }
    if (getCurrentBoard()) {
      getDashboard(getCurrentBoard(), res => {
        if (!res) {
          localStorage.removeItem("dashboard");
          return;
        }

        setTaskState(res);
        setCurrentBoard(res._id);
      });
      getDashboardTitles(res => {
        setdbTitles(res);
      });
    } else {
      getDashboard(dashboardId, res => {
        if (!res) {
          localStorage.removeItem("dashboard");
          return;
        }
        setTaskState(res);
        setCurrentBoard(res._id);
      });
      getDashboardTitles(res => {
        setdbTitles(res);
      });
    }
  }, []);
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }
    //Check if it is dropped to same column and same index
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //For moving column
    if (type === "column") {
      const newColumnOrder = Array.from(taskState.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setTaskState({ ...taskState, columnOrder: newColumnOrder });
      updateColumnIndex(dashboardId, newColumnOrder, draggableId);
      return;
    }

    const start = taskState.columns[source.droppableId];
    const finish = taskState.columns[destination.droppableId];

    //for the case task move around in same column
    if (start === finish) {
      const taskOrder = Array.from(start.taskOrder);
      taskOrder.splice(source.index, 1);
      taskOrder.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskOrder: taskOrder
      };

      setTaskState({
        ...taskState,
        columns: {
          ...taskState.columns,
          [newColumn._id]: newColumn
        }
      });
      updateTaskIndexInColumn(dashboardId, newColumn._id, taskOrder);
      return;
    }

    //Move task to other column
    const startTaskOrder = Array.from(start.taskOrder);
    const startTaskIndex = source.index;
    const startColumn = source.droppableId;
    const endColumn = destination.droppableId;
    let movedTaskId;

    //Delete moved task from tasks in original column
    const newStartTasks = Object.keys(start.tasks).reduce((object, key) => {
      if (key !== startTaskOrder[startTaskIndex]) {
        object[key] = start.tasks[key];
      } else {
        movedTaskId = startTaskOrder[startTaskIndex];
      }
      return object;
    }, {});

    //update original column
    startTaskOrder.splice(source.index, 1);
    const newStart = {
      ...start,
      taskOrder: startTaskOrder,
      tasks: newStartTasks
    };

    //update destination column
    const finishTaskOrder = Array.from(finish.taskOrder);
    finishTaskOrder.splice(destination.index, 0, draggableId);

    let movedTask = taskState.columns[startColumn].tasks[movedTaskId];
    let existedTasks = taskState.columns[endColumn].tasks;

    existedTasks[movedTask._id] = movedTask;

    //new destination column
    const newFinish = {
      ...finish,
      taskOrder: finishTaskOrder,
      tasks: { ...existedTasks }
    };

    setTaskState({
      ...taskState,
      columns: {
        ...taskState.columns,
        [newStart._id]: newStart,
        [newFinish._id]: newFinish
      }
    });

    moveTasksToOther(dashboardId, newStart, newFinish);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!taskState || dashboardId === "createboard") {
    return <CreateBoardColumn open={open} handleClose={handleClose} dashboard />;
  } else {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='"horizontal' type='column'>
          {(provided, snapshot) => (
            <div className={classes.root} {...provided.droppableProps} ref={provided.innerRef}>
              <CreateColumnButton
                position='left'
                noColumn={
                  taskState.columnOrder === undefined || taskState.columnOrder.length === 0
                    ? true
                    : false
                }
                isDraggingOver={snapshot.isDraggingOver}
              />
              {taskState.columnOrder.map((columnId, index) => {
                const column = taskState.columns[columnId];
                let taskOrder = taskState.columns[columnId].taskOrder || [];
                let tasks = taskOrder.map((task, i) => {
                  return column.tasks[task];
                });

                return (
                  <div key={index} className={classes.columns}>
                    <Column
                      key={columnId}
                      column={column}
                      tasks={tasks}
                      index={index}
                      dashboardId={taskState._id}
                    />
                  </div>
                );
              })}

              {taskState.columnOrder === undefined || taskState.columnOrder.length === 0 ? null : (
                <CreateColumnButton position='right' isDraggingOver={snapshot.isDraggingOver} />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    overflow: "auto",
    minHeight: "100vh"
  },
  columns: {
    userSelect: "none",
    padding: " 4 * 2"
  }
}));

export default withRouter(ColumnArea);
