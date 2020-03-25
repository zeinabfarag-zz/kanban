import React, { useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tag from "./Tag";
import { CardContext } from "./CreateCard/cardContext";
import { Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router-dom";

const TaskCard = ({ index, task, props, columnId }) => {
  const classes = useStyles(props);

  const card = useContext(CardContext);
  const { handleCurrentTask } = card;
  const history = useHistory();

  return (
    <Draggable draggableId={task._id} index={index}>
      {provided => (
        <Card
          className={classes.root}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => {
            handleCurrentTask(task._id, columnId, history);
          }}>
          <CardContent>
            {task.tag && <Tag color={task.tag} />}
            <Typography>{task.title}</Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

//Styling part
const useStyles = makeStyles({
  root: {
    borderRadius: 5,
    marginBottom: ".5rem",
    backgroundColor: "white",
    cursor: "move"
  }
});

export default TaskCard;
