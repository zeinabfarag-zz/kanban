import React, { useContext } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import "react-datepicker/dist/react-datepicker.css";
import { CardContext } from "./cardContext";

const Attachment = () => {
  const card = useContext(CardContext);
  const { attachment, handleAttachmentChange, openAttachment } = card;

  return (
    (openAttachment || !!attachment.length) && (
      <Grid item container>
        <Grid item xs={1}>
          <AttachmentIcon color="primary" />
        </Grid>

        <Grid item xs={11}>
          <Typography gutterBottom variant="h3">
            Attachment:
          </Typography>

          <Box>
            {attachment.map(file => {
              return (
                <a key={file.url} href={file.url}>
                  {file.name}
                </a>
              );
            })}
          </Box>
          {openAttachment && (
            <input type="file" name="file" onChange={handleAttachmentChange} />
          )}
        </Grid>
      </Grid>
    )
  );
};

export default Attachment;
