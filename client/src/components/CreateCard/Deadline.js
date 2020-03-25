import React, { useContext } from "react";
import { Grid, Typography, Link } from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import parseISO from "date-fns/parseISO";
import { CardContext } from "./cardContext";

const Deadline = () => {
  const card = useContext(CardContext);
  const { deadline, handleDeadlineChange, openDeadline } = card;

  return (
    openDeadline && (
      <Grid item container>
        <Grid item xs={1}>
          <AccessTimeIcon color="primary" />
        </Grid>

        <Grid item xs={11}>
          <Typography gutterBottom variant="h3">
            Deadline:
          </Typography>
          <Link variant="subtitle2" underline="always">
            <DatePicker
              style={{ border: "1px solid red" }}
              selected={deadline && parseISO(deadline)}
              popperPlacement="top-start"
              onChange={handleDeadlineChange}
              dateFormat="MMMM d, yyyy"
            />
          </Link>
        </Grid>
      </Grid>
    )
  );
};

export default Deadline;
