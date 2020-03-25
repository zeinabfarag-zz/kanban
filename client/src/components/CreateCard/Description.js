import React, { useContext } from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";
import { CardContext } from "./cardContext";

const Description = ({ dashboardId }) => {
  const card = useContext(CardContext);
  const { description, handleDescriptionChange } = card;

  return (
    <Grid item container>
      <Grid item xs={1}>
        <MenuBookOutlinedIcon color="primary" />
      </Grid>

      <Grid item xs={11}>
        <Typography variant="h3" gutterBottom>
          Description:
        </Typography>
        <TextField
          placeholder="Add description..."
          value={description}
          onChange={e => handleDescriptionChange(e)}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
      </Grid>
    </Grid>
  );
};

export default Description;
