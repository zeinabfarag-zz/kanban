import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const BlueButton = props => {
  const useStyles = makeStyles(theme => ({
    button: {
      marginTop: props.mini ? 0 : theme.spacing(4),
      color: "white",
      textTransform: "none",
      width: props.mini ? "auto" : "45%",
      height: props.mini ? "auto" : theme.spacing(6)
    }
  }));
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      type="submit"
      variant="contained"
      color="primary"
      size={props.mini ? "small" : "large"}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default BlueButton;
