import React, { useContext, useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";

import { CardContext } from "./cardContext";
import { useHistory, useLocation } from "react-router-dom";

const DeleteModal = () => {
  const card = useContext(CardContext);
  const { openDelete, handleCloseDelete, handleDelete } = card;
  const history = useHistory();

  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);

  return (
    <Dialog
      open={openDelete}
      onClose={handleCloseDelete}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Are you sure you want to delete this task?
      </DialogTitle>

      <DialogActions>
        <Button color="primary" onClick={handleCloseDelete}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => handleDelete(calendarView, history)}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
