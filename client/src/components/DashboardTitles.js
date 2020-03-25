import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  IconButton
} from "@material-ui/core";
import { UserContext } from "../userContext";
import { useHistory, useLocation } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { getDashboard } from "../utils/handleUpdateTasks";
import { setCurrentBoard } from "../AuthService";

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
});

const DashboardTitles = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const { value1 } = useContext(UserContext);
  let [, setTaskState] = value1;
  let history = useHistory();

  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);

  const toggleDrawer = toggle => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(toggle);
  };

  const switchDashboard = boardId => {
    getDashboard(boardId, res => {
      setTaskState(res);
      setCurrentBoard(boardId);
      console.log(res._id);
      calendarView
        ? history.push(`/calendar/${boardId}`)
        : history.push(`/dashboards/${boardId}`);
    });
  };

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {props.titles.map((title, index) => (
        <div>
          <List key={title} onClick={() => switchDashboard(props.ids[index])}>
            <ListItem button>
              <ListItemText primary={title} />
            </ListItem>
          </List>
          <Divider />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={toggleDrawer(true)}
      >
        <MoreHorizIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {sideList("right")}
      </Drawer>
    </div>
  );
};

export default DashboardTitles;
