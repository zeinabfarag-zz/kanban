import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import BlueButton from "./BlueButton";

import {
  addColumn,
  addDashboard,
  updateColumnName,
  getDashboardTitles
} from "../utils/handleUpdateTasks";
import { UserContext } from "../userContext";
import { handleError } from "../utils/handleAlerts";
import { setCurrentBoard } from "../AuthService";

import { withRouter, useLocation } from "react-router-dom";
import { handleSuccess } from "../utils/handleAlerts";

const TitleInputModal = props => {
  const { open, handleClose, position, dashboard, column, columnId, columnTitle } = props;
  const [title, setTitle] = useState(columnTitle);
  const [error, setError] = useState(false);
  const { value1, dashboardTitles } = useContext(UserContext);
  let [taskState, setTaskState] = value1;
  let [, setDbTitles] = dashboardTitles;
  let dashboardId = taskState && taskState._id;
  let history = props.history;
  let btnText = "Create";
  let titleText = "";

  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);

  if (dashboard) {
    titleText = "Create Board";
  } else if (column) {
    titleText = "Change title";
    btnText = "change";
  } else {
    titleText = "Create Column";
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (!title) {
      setError(true);
    } else if (dashboard) {
      addDashboard(title, res => {
        setTaskState(res);
        setTitle("");

        let newDbUrl = res._id;
        getDashboardTitles(res => {
          setDbTitles(res);
        });
        setCurrentBoard(newDbUrl);
        handleClose(false);
        calendarView
          ? history.push(`/calendar/${newDbUrl}`)
          : history.push(`/dashboards/${newDbUrl}`);
      });
    } else if (column) {
      if (columnTitle === title) {
        handleClose(false);
        return;
      }
      if (!title) {
        handleClose(false);
        setTitle(columnTitle);
        return;
      }
      updateColumnName(dashboardId, columnId, title, res => {
        setTaskState(res);
        setTitle("");
        handleClose(false);
        handleSuccess(`the column has been renamed!`);
      });

      handleClose(false);
    } else {
      try {
        addColumn(dashboardId, title, position, res => {
          setTaskState(res);
          setTitle("");
          handleClose(false);
          handleSuccess(`${res.title} has been added!`);
        });
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleChange = value => {
    setTitle(value);
    setError(false);
  };

  const useStyles = makeStyles(theme => ({
    root: {
      padding: "3%",
      textAlign: "center"
    },
    closeButton: {
      position: "absolute",
      top: 1,
      right: 1,
      color: theme.palette.grey[500]
    }
  }));

  const handleCloseResetTitle = () => {
    if (column) {
      setTitle(columnTitle);
    } else {
      setTitle("");
    }
    handleClose(false);
    setError(false);
  };

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseResetTitle}
        aria-labelledby='form-dialog-title'
        PaperProps={{
          className: classes.root
        }}>
        <DialogTitle disableTypography id='form-dialog-title'>
          {dashboard ? null : (
            <IconButton
              onClick={handleCloseResetTitle}
              className={classes.closeButton}
              aria-label='close'>
              <CloseIcon />
            </IconButton>
          )}
          <Typography variant='h1'>{titleText}</Typography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label='Add Title'
              variant='outlined'
              margin='normal'
              value={title || ""}
              onChange={e => handleChange(e.target.value)}
              helperText={error && "Title Required"}
              error={error}
              autoFocus
              fullWidth></TextField>
            <BlueButton type='submit'>{btnText}</BlueButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withRouter(TitleInputModal);
