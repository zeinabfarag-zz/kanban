import React, { useState } from "react";

import ControlPoint from "@material-ui/icons/ControlPoint";
import Card from "@material-ui/core/Card";
import TitleInputModal from "./TitleInputModal";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

const CreateColumnButton = props => {
  const classes = useStyles(props);
  const [open, setOpen] = useState(false);
  const { position, isDraggingOver, noColumn } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Card
        className={
          isDraggingOver ? classes.isDraggingOver : noColumn ? classes.noColumn : classes.addColumn
        }
        onClick={handleClickOpen}>
        <CardContent>
          <ControlPoint className={classes.plusIcon} />
        </CardContent>
      </Card>
      <TitleInputModal open={open} handleClose={handleClose} position={position} />
    </div>
  );
};

const useStyles = makeStyles({
  addColumn: {
    backgroundColor: "#D3D3D3",
    minHeight: "400px",
    maxWidth: "100px",
    overflow: "hidden",
    color: "white",
    textAlign: "left",
    lineHeight: "normal",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.2s",
    opacity: 0,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
      color: "white"
    }
  },
  noColumn: {
    backgroundColor: "white",
    minHeight: 100,
    minWidth: 300,
    marginLeft: 100,
    overflow: "hidden",
    color: "#D3D3D3",
    lineHeight: "normal",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.2s",
    opacity: 1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#D3D3D3",
      opacity: 1,
      color: "white"
    }
  },
  isDraggingOver: {
    opacity: 0
  },
  plusIcon: {
    fontSize: 50
  }
});

export default CreateColumnButton;
