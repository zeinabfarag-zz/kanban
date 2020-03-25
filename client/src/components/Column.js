import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CardContext } from "./CreateCard/cardContext";

import TaskCard from "./TaskCard";
import BlueButton from "./BlueButton";
import DropDownMenu from "../components/DropDownMenu";
//check how to use Cards in column data

//materialUi
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { useHistory } from 'react-router-dom'

//Drag and Drop
import { Droppable, Draggable } from "react-beautiful-dnd";

const Column = props => {
  const classes = useStyles(props);
  const { column, tasks, index, dashboardId } = props;

  const card = useContext(CardContext);
  const { handleCurrentTask } = card;
  const history = useHistory();

  return (
    <Draggable draggableId={column._id} index={index}>
      {provided => (
        <Card {...provided.draggableProps} ref={provided.innerRef} className={classes.root}>
          <CardContent>
            <Grid container direction='row' justify='space-between' alignItems='flex-start'>
              <Typography variant='h5' className={classes.title} {...provided.dragHandleProps}>
                {column.title}
              </Typography>
              <DropDownMenu
                column
                columnId={column._id}
                dashboardId={dashboardId}
                title={column.title}
              />
            </Grid>
            <Droppable droppableId={column._id} type='card'>
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => {
                    return (
                      <TaskCard key={task._id} task={task} index={index} columnId={column._id} />
                    );
                  })}
                  {provided.placeholder}

                  <BlueButton mini onClick={() => handleCurrentTask(null, column._id, history)}>
                    Add a Card
                  </BlueButton>
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

//Styling part
const useStyles = makeStyles({
  root: {
    backgroundColor: "#F4F6FF",
    // minHeight: 50
    width: "300px",
    margin: "0 1rem",
    color: "black",
    textAlign: "left",
    lineHeight: "normal",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    textAlign: "left",
    marginBottom: 15
  },
  addColumn: {
    backgroundColor: "#F4F6FF",
    height: 200,
    width: "15rem",
    margin: "0 1rem",
    color: "black",
    textAlign: "left",
    lineHeight: "normal",
    display: "flex",
    flexDirection: "column"
  },
  cancel: {
    color: "grey"
  }
});

export default Column;
