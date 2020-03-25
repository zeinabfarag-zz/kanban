import React, { useContext, useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Typography from "@material-ui/core/Typography";
import { UserContext } from "../userContext";
import { deleteColumn, getDashboard } from "../utils/handleUpdateTasks";
import { useParams } from "react-router-dom";
import { setCurrentBoard } from "../AuthService";
import TitleInputModal from "../components/TitleInputModal";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import { logout } from "../AuthService";
import { makeStyles } from "@material-ui/core/styles";
import { handleSuccess } from "../utils/handleAlerts";

export default function DropDownMenu(props) {
  const ITEM_HEIGHT = 48;
  const { column, columnId, title, topNav } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const { value1 } = useContext(UserContext);
  let [taskState, setTaskState] = value1;
  let options = [];

  const { dashboardId } = useParams();
  let boardId = (taskState && taskState._id) || dashboardId;

  useEffect(() => {
    getDashboard(boardId, res => {
      setTaskState(res);
      setCurrentBoard(boardId);
    });
  }, []);

  if (column) {
    options = ["Rename", "Delete"];
  } else {
    options = ["Logout"];
  }
  const handleClickDropDown = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropDown = () => {
    setAnchorEl(null);
  };

  const deleteColumnTrigger = () => {
    deleteColumn(boardId, columnId, res => {
      setTaskState(res);
      handleSuccess(`The column has been deleted!`);
    });
    handleCloseDropDown();
  };

  const renameTrigger = () => {
    handleClickOpen();
    handleCloseDropDown();
  };

  const logoutTrigger = () => {
    logout();
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const onClickObject = {
    Rename: renameTrigger,
    Delete: deleteColumnTrigger,
    Logout: logoutTrigger
  };

  const useStyles = makeStyles(theme => ({
    icon: {
      marginLeft: 50,
      width: 50,
      height: 50
    }
  }));
  const classes = useStyles();

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        className={topNav ? classes.icon : ""}
        onClick={handleClickDropDown}
      >
        {topNav ? (
          <AccountCircleOutlinedIcon fontSize="large" />
        ) : (
          <MoreHorizIcon />
        )}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseDropDown}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {options ? (
          options.map(option => {
            let onClick = onClickObject[option];
            return (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={() => onClick()}
              >
                <Typography>{option}</Typography>
              </MenuItem>
            );
          })
        ) : (
          <h1>no board exist</h1>
        )}
      </Menu>
      <TitleInputModal
        open={openModal}
        handleClose={handleClose}
        columnId={columnId}
        columnTitle={title}
        column
      />
    </div>
  );
}
