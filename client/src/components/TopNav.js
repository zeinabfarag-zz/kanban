import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import WebOutlinedIcon from "@material-ui/icons/WebOutlined";
import logo from "../images/logo.png";
import BlueButton from "./BlueButton";
import AppBar from "@material-ui/core/AppBar";
import AddIcon from "@material-ui/icons/Add";
import TitleInputModal from "../components/TitleInputModal";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";
import { getCurrentBoard } from "../AuthService";

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);
  let dashboardId = getCurrentBoard();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      height: 100,
      backgroundColor: "white",
      padding: "0px 25px"
    },
    link: {
      display: "flex",
      fontSize: " 20px",
      marginRight: 30,
      marginLeft: 30,
      "&:hover": {
        cursor: "pointer"
      }
    },
    inactive: {
      color: "#545454"
    },
    wrapper: {
      display: "flex"
    },
    btn: {
      color: "white",
      backgroundColor: "#759CFC",
      marginRight: 6000
    },
    profPic: {
      height: 50,
      width: 50,
      borderRadius: 100,
      marginLeft: 50
    }
  }));
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Grid
            position="static"
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            className={classes.root}
          >
            <img src={logo} alt="logo" />
            <div className={classes.wrapper}>
              <Link to={`/dashboards/${dashboardId}`}>
                <div
                  className={`${classes.link} ${calendarView &&
                    classes.inactive}`}
                >
                  <WebOutlinedIcon className={classes.icon} />
                  <Typography>Dashboard</Typography>
                </div>
              </Link>
              <Link to={`/calendar/${dashboardId}`}>
                <div
                  className={`${classes.link} ${!calendarView &&
                    classes.inactive}`}
                >
                  <CalendarTodayIcon className={classes.icon} />
                  <Typography>Calendar</Typography>
                </div>
              </Link>
            </div>
            <div className={classes.wrapper}>
              <BlueButton
                mini
                className={classes.btn}
                onClick={handleClickOpen}
              >
                <AddIcon className={classes.icon} />
                <Typography>Create board</Typography>
              </BlueButton>
              <DropDownMenu topNav />
            </div>
          </Grid>
        </Toolbar>
      </AppBar>
      <TitleInputModal open={open} handleClose={handleClose} dashboard />
    </div>
  );
};
export default TopNav;
