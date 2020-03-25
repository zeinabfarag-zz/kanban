const express = require("express");
const router = express.Router();
const updateData = require("../util/util");
const checkToken = require("../auth/validateToken");

// Models;
const { Task, Column, Dashboard } = require("../models/Dashboard");
const Calendar = require("../models/Calendar");
const User = require("../models/User");

//Retrieve specific dashboard
router.get("/:dashboardId", checkToken, async (req, res) => {
  let userId = req.decoded.id;
  let id = req.params.dashboardId;

  try {
    let result = await Dashboard.findOne({ user: userId, _id: id });

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Dashboard does not exist" });
  }
});

//@get dashboard titles
router.get("/", checkToken, async (req, res) => {
  let userId = req.decoded.id;
  try {
    let result = await Dashboard.find({ user: userId }).select("title");

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Dashboard does not exist" });
  }
});

//Add Dashboard @Done
router.post("/", checkToken, async (req, res) => {
  const { title } = req.body;
  let userId = req.decoded.id;

  if (!title) {
    return res.status(401).json({ error: "Please Enter dashboard title" });
  }

  try {
    const column1 = new Column({
      title: "In Progress",
      taskOrder: [],
      tasks: {}
    });
    const column2 = new Column({
      title: "Completed",
      taskOrder: [],
      tasks: {}
    });

    const newDashBoard = new Dashboard({
      user: userId,
      title: title,
      columns: { [column1._id]: column1, [column2._id]: column2 },
      columnOrder: [column1.id, column2.id]
    });

    let result = await newDashBoard.save();

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { dashboardIds: result._id } }
    );

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to add dashboard" });
  }
});

//delete dashboard @To Do delete
router.delete("/:dashboardId", checkToken, async (req, res) => {
  const { dashboardId } = req.params;
  let userId = req.decoded.id;
  Dashboard.remove({ _id: dashboardId }, function(err) {
    if (!err) {
      res.status(200).json({ result: "Dashboard deleted" });
    } else {
      console.log(err);
      return res.status(400).json({ error: "Failed to delete dashboard" });
    }
  });
  User.findOneAndUpdate(
    { _id: userId, dashboardIds: dashboardId },
    { $pull: { dashboardIds: dashboardId } }
  );
});

// Add a column @Done

router.post("/:dashboardId/columns", checkToken, async (req, res) => {
  const { title, position } = req.body;
  const { dashboardId } = req.params;
  try {
    if (!title) {
      return res.status(401).json({ error: "Please Enter column title" });
    }
    let board = await Dashboard.findOne({ _id: dashboardId });

    const newColumn = new Column({
      title,
      tasks: [],
      taskOrder: []
    });

    board.columns.set(newColumn._id.toString(), newColumn);

    if (position === "left") {
      board.columnOrder.unshift(newColumn._id.toString());
    } else {
      board.columnOrder.push(newColumn._id);
    }

    const result = await board.save();
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to add column" });
  }
});

//delete column @done
router.delete(
  "/:dashboardId/columns/:columnId",
  checkToken,
  async (req, res) => {
    const { dashboardId, columnId } = req.params;
    try {
      //data manipulation
      let updateCond = {};

      updateCond["$unset"] = {};
      updateCond["$unset"]["columns." + columnId] = "";
      updateCond["$pull"] = {};
      updateCond["$pull"]["columnOrder"] = columnId;

      //delete all tasks in calendar
      await Calendar.updateMany(
        { dashboard: dashboardId },
        { $pull: { deadlines: { column: columnId } } },
        { safe: true, multi: true }
      );

      const result = await updateData(Dashboard, dashboardId, updateCond);
      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to delete column" });
    }
  }
);

// Add a task @Done
router.post(
  "/:dashboardId/columns/:columnId/tasks",
  checkToken,
  async (req, res) => {
    const { title, description, deadline, tag, attachment } = req.body;
    const { dashboardId, columnId } = req.params;

    try {
      const newTask = new Task({
        title,
        description,
        tag,
        deadline,
        attachment
      });

      if (!title) {
        return res.status(401).json({ error: "Please Enter task title" });
      }

      let newTasks = {};
      let board = await Dashboard.findOne({ _id: dashboardId });
      let Column = await board.columns.get(columnId);

      for (const key of Column.tasks.keys()) {
        let item = Column.tasks.get(key);
        newTasks[item.id] = item;
      }

      newTasks = {
        ...newTasks,
        [newTask._id]: newTask
      };

      //data manipulation
      let updateCond = {};
      updateCond["$set"] = {};
      updateCond["$set"]["columns." + columnId + ".tasks"] = newTasks;
      updateCond["$push"] = {};
      updateCond["$push"]["columns." + columnId + ".taskOrder"] = newTask._id;

      //Add calendar if deadline in card
      if (deadline) {
        let calendar = await Calendar.findOne({ dashboard: dashboardId });
        //add card to existing calendar
        if (calendar) {
          calendar.deadlines.push({
            start: deadline,
            column: columnId,
            title,
            task: newTask._id,
            description,
            tag,
            attachment
          });
        } else {
          //create new calendar
          calendar = new Calendar({
            dashboard: dashboardId,
            deadlines: [
              {
                start: deadline,
                column: columnId,
                task: newTask._id,
                title,
                description,
                tag,
                attachment
              }
            ]
          });
        }
        calendar.save();
      }

      const result = await updateData(Dashboard, dashboardId, updateCond);
      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to add task" });
    }
  }
);

//Update card Data
router.put(
  "/:dashboardId/columns/:columnId/tasks/:taskId",
  checkToken,
  async (req, res) => {
    try {
      const { title, description, deadline, tag, attachment } = req.body;
      const { dashboardId, columnId, taskId } = req.params;

      if (!title) {
        return res.status(401).json({ error: "Please Enter task title" });
      }

      let newTask = {
        title,
        description,
        deadline,
        tag,
        attachment,
        _id: taskId
      };

      let updateCond = {};
      updateCond["$set"] = {};
      updateCond["$set"]["columns." + columnId + ".tasks." + taskId] = newTask;

      const result = await updateData(Dashboard, dashboardId, updateCond);
      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update task" });
    }
  }
);

//delete card @done
router.delete(
  "/:dashboardId/columns/:columnId/tasks/:taskId",
  checkToken,
  async (req, res) => {
    const { dashboardId, columnId, taskId } = req.params;

    try {
      //data manipulation
      let updateCond = {};
      updateCond["$unset"] = {};
      updateCond["$unset"]["columns." + columnId + ".tasks." + taskId] = "";
      updateCond["$pull"] = {};
      updateCond["$pull"]["columns." + columnId + ".taskOrder"] = taskId;

      const result = await updateData(Dashboard, dashboardId, updateCond);
      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to delete task" });
    }
  }
);

//update ColumnTitle
router.put("/:dashboardId/columns/:columnId", checkToken, async (req, res) => {
  try {
    const { title } = req.body;
    const { dashboardId, columnId } = req.params;

    if (!title) {
      return res.status(401).json({ error: "Please Enter column title" });
    }

    let updateCond = {};
    updateCond["$set"] = {};
    updateCond["$set"]["columns." + columnId + ".title"] = title;

    const result = await updateData(Dashboard, dashboardId, updateCond);
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to update task" });
  }
});

//Update column index @Done
router.put(
  "/:dashboardId/columns/:columnId/columnOrder",
  checkToken,
  async (req, res) => {
    try {
      const { dashboardId } = req.params;
      const { columnOrder } = req.body;
      //data manipulation
      let updateCond = {};
      updateCond["$set"] = {};
      updateCond["$set"]["columnOrder"] = columnOrder;

      const result = await updateData(Dashboard, dashboardId, updateCond);

      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to delete column" });
    }
  }
);

//Update task index within same column @Done
router.put(
  "/:dashboardId/columns/:columnId/taskOrder",
  checkToken,
  async (req, res) => {
    try {
      const { taskOrder } = req.body;
      const { dashboardId, columnId } = req.params;

      //data manipulation
      let updateCond = {};
      updateCond["$set"] = {};
      updateCond["$set"]["columns." + columnId + ".taskOrder"] = taskOrder;

      const result = await updateData(Dashboard, dashboardId, updateCond);
      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to move task" });
    }
  }
);

//Update task index between Column @Done
router.put(
  "/:dashboardId/columns/:columnId/taskColumnOrder",
  checkToken,
  async (req, res) => {
    const {
      columnSourceTasks,
      columnSourceTaskOrder,
      columnToSourceId,
      columnToTasks,
      columnToTaskOrder
    } = req.body;

    const { dashboardId, columnId } = req.params;

    try {
      let updateCond = {};
      updateCond["$set"] = {};
      updateCond["$set"]["columns." + columnId + ".tasks"] = columnSourceTasks;
      updateCond["$set"][
        "columns." + columnId + ".taskOrder"
      ] = columnSourceTaskOrder;
      updateCond["$set"][
        "columns." + columnToSourceId + ".tasks"
      ] = columnToTasks;
      updateCond["$set"][
        "columns." + columnToSourceId + ".taskOrder"
      ] = columnToTaskOrder;

      //if moving task is in calendar, update column
      const movingTaskId = Object.keys(columnToTasks).pop();
      await Calendar.findOneAndUpdate(
        { dashboard: dashboardId, "deadlines.task": movingTaskId },
        {
          $set: {
            "deadlines.$.column": columnToSourceId
          }
        },
        { new: true }
      );

      const result = await updateData(Dashboard, dashboardId, updateCond);

      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to move task to the column" });
    }
  }
);

module.exports = router;
