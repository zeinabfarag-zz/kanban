import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { UserContext } from "../userContext";
import { getDashboardTitles } from "../utils/handleUpdateTasks";

import DashboardTitles from "./DashboardTitles";

const BlueNav = () => {
  const { value1, dashboardTitles } = useContext(UserContext);
  const [dbTitles, setdbTitles] = dashboardTitles;
  let dbTitlesArray = [];
  let dbIdArray = [];

  useEffect(() => {
    getDashboardTitles(res => {
      setdbTitles(res);
    });
  }, []);

  for (let i = 0; i < dbTitles.length; i++) {
    dbTitlesArray.push(dbTitles[i].title);
    dbIdArray.push(dbTitles[i]._id);
  }

  let [taskState] = value1;
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      height: 70,
      color: "white",
      display: "flex",
      justifyContent: "center",
      marginBottom: 50
    },
    menuButton: {},
    title: {
      flexGrow: 1,
      marginLeft: 50
    }
  }));
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {taskState ? taskState.title : "My Board"}
        </Typography>
        <DashboardTitles ids={dbIdArray} titles={dbTitlesArray} />
      </Toolbar>
    </AppBar>
  );
};
export default BlueNav;
