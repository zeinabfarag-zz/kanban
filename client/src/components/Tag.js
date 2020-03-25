import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const Tag = props => {
  const useStyles = makeStyles({
    tag: {
      margin: "10px 0",
      borderRadius: 10,
      height: 10,
      width: props.card ? 60 : 50,
      backgroundColor: props.color || "white",
      display: props.card && "inline-block",
      marginLeft: props.card && "3%"
    }
  });

  const classes = useStyles(props);

  return <div className={classes.tag} onClick={props.onClick}></div>;
};

export default Tag;
