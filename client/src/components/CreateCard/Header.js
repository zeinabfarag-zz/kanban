import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Typography, TextField } from "@material-ui/core";
import Tag from "../Tag";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import CloseIcon from "@material-ui/icons/Close";
import SelectTag from "./SelectTag";
import { useHistory, useLocation } from "react-router-dom";

import { CardContext } from "./cardContext";

const Header = ({ dashboardId }) => {
  const card = useContext(CardContext);
  const history = useHistory();
  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);

  const {
    title,
    handleTitleChange,
    columnName,
    handleCloseCard,
    tag,
    handleOpenTag,
    openTag,
    error
  } = card;

  const useStyles = makeStyles(theme => ({
    header: {
      borderBottom: "2px rgba(117,156,252, 0.1) solid"
    },
    closeButton: {
      position: "absolute",
      top: 1,
      right: 1,
      color: theme.palette.grey[500]
    },
    text: {
      fontSize: 18
    }
  }));

  const classes = useStyles();

  const handleClose = () => {
    if (calendarView) {
      history.push(`/calendar/${dashboardId}`);
    } else {
      history.push(`/dashboards/${dashboardId}`);
    }

    handleCloseCard();
  };

  return (
    <Grid item xs={12} className={classes.header}>
      <IconButton
        onClick={handleClose}
        className={classes.closeButton}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Grid item xs={12} container>
        <Grid item xs={1}>
          <AssignmentOutlinedIcon color="primary" fontSize="large" />
        </Grid>

        <Grid item xs={11}>
          <TextField
            placeholder="Add title..."
            value={title}
            autoFocus={!title}
            InputProps={{ classes: { input: classes.text } }}
            onChange={e => handleTitleChange(e)}
            helperText={error && "Title Required"}
            error={!!error}
          />
          {openTag ? (
            <SelectTag />
          ) : (
            tag && <Tag onClick={handleOpenTag} color={tag} card />
          )}
          <Typography variant="subtitle2" display="block" color="secondary">
            In list "{columnName}"
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
