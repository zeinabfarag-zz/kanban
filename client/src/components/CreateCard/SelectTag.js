import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { CardContext } from "./cardContext";

const useStyles = makeStyles(theme => ({
  root: {
    display: "inline-flex",
    "& > *": {
      margin: theme.spacing(1)
    },
    marginLeft: "3%",
    "& div": {
      borderRadius: "50%",
      width: "20px",
      height: "20px"
    },
    "& div:hover": {
      border: "1px solid #B5C0D9"
    }
  },
  green: {
    backgroundColor: "#5ACD76"
  },
  red: {
    backgroundColor: "#FF5D48"
  },
  yellow: {
    backgroundColor: "#EDAB1D"
  },
  blue: {
    backgroundColor: "#759CFC"
  },
  purple: {
    backgroundColor: "#D460F7"
  }
}));

const SelectTag = () => {
  const classes = useStyles();

  const card = useContext(CardContext);
  const { handleTagChange } = card;

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" color="secondary">
        Select Tag:
      </Typography>
      <div
        className={classes.green}
        onClick={() => handleTagChange("#5ACD76")}
      />
      <div className={classes.red} onClick={() => handleTagChange("#FF5D48")} />
      <div
        className={classes.yellow}
        onClick={() => handleTagChange("#EDAB1D")}
      />
      <div
        className={classes.blue}
        onClick={() => handleTagChange("#759CFC")}
      />
      <div
        className={classes.purple}
        onClick={() => handleTagChange("#D460F7")}
      />
    </div>
  );
};

export default SelectTag;
