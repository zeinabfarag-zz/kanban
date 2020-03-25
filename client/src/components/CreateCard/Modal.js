import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, Grid } from "@material-ui/core";
import Header from "./Header";
import Description from "./Description";
import Deadline from "./Deadline";
import ButtonList from "./ButtonList";
import { CardContext } from "./cardContext";
import { authFetch, getCurrentBoard } from "../../AuthService";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { handleError } from "../../utils/handleAlerts";
import DeleteModal from "./DeleteModal";
import BlueButton from "../BlueButton";
import Attachment from "./Attachment";

const CardModal = () => {
  const card = useContext(CardContext);
  const { openCard, handleCloseCard, fetchCard, handleSubmit } = card;
  const { columnId, taskId } = useParams();
  const path = useLocation().pathname;
  const [calendarView] = useState(path.includes("/calendar") ? true : false);
  const history = useHistory();
  let dashboardId = getCurrentBoard();

  useEffect(() => {
    if ((dashboardId, columnId, taskId)) {
      const fetchUrlCard = async () => {
        try {
          const res = await authFetch(`/dashboards/${dashboardId}`, {
            method: "GET"
          });

          const column = res.result.columns[columnId]._id;
          const task = res.result.columns[columnId].tasks[taskId]._id;
          const dashboard = res.result._id;

          if (
            column !== columnId ||
            task !== taskId ||
            dashboard !== dashboardId
          ) {
            routeChange();

            handleError("cannot access");
          } else {
            fetchCard(taskId, columnId, res.result);
          }
        } catch (e) {
          routeChange();

          handleError("cannot access");
        }
      };
      fetchUrlCard();
    }
  }, []);

  const handleClose = () => {
    routeChange();
    handleCloseCard();
  };

  const routeChange = () => {
    if (calendarView) {
      history.push(`/calendar/${dashboardId}`);
    } else {
      history.push(`/dashboards/${dashboardId}`);
    }
  };

  const submitCard = () => {
    handleSubmit();
    routeChange();
  };

  return (
    <Dialog
      open={openCard}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: { paddingBottom: "3%" }
      }}
    >
      <DialogContent>
        <Grid container spacing={4}>
          <Header dashboardId={dashboardId} />
          <Grid item xs={10} container spacing={4}>
            <Description dashboardId={dashboardId} />
            <DeleteModal dashboardId={dashboardId} />
            <Deadline dashboardId={dashboardId} />
            <Attachment dashboardId={dashboardId} />
          </Grid>
          <ButtonList dashboardId={dashboardId} />

          <Grid justify="center" item xs={12} container>
            <BlueButton onClick={submitCard} mini>
              Save
            </BlueButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
