import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const CardButton = props => {
  const useStyles = makeStyles(() => ({
    button: {
      backgroundColor: props.delete ? "secondary" : "#F4F6FF",
      color: props.delete ? "white" : "#B5C0D9",
      marginBottom: "5%",
      textTransform: "none",
      "&:hover": {
        color: "white"
      }
    }
  }));

  const classes = useStyles();
  return (
    <Button
      size="small"
      variant="contained"
      className={classes.button}
      onClick={props.onClick}
      disableElevation
      fullWidth
    >
      {props.children}
    </Button>
  );
};

export default CardButton;
