const express = require("express");
const router = express.Router();
const checkToken = require("../auth/validateToken");

// Models;
const Calendar = require("../models/Calendar");

router.put(
  "/:dashboardId/columns/:columnId/tasks/:taskId",
  checkToken,
  async (req, res) => {
    try {
      const { dashboardId, columnId, taskId } = req.params;
      const { title, deadline, description, tag, attachment } = req.body;

      const task = await Calendar.findOne({ "deadlines.task": taskId });
      let calendar = await Calendar.findOne({ dashboard: dashboardId });
      let result;

      //update card within calendar
      if (task && calendar) {
        result = await Calendar.findOneAndUpdate(
          { dashboard: dashboardId, "deadlines.task": taskId },
          {
            $set: {
              "deadlines.$.title": title,
              "deadlines.$.start": deadline,
              "deadlines.$.description": description,
              "deadlines.$.tag": tag,
              "deadlines.$.attachment": attachment
            }
          },
          { new: true }
        );
      } else if (calendar) {
        //add card to calendar
        calendar.deadlines.push({
          start: deadline,
          column: columnId,
          title,
          task: taskId,
          description,
          tag,
          attachment
        });
        result = await calendar.save();
      } else {
        //add calendar with card
        const newCalendar = new Calendar({
          dashboard: dashboardId,
          deadlines: [
            {
              start: deadline,
              column: columnId,
              task: taskId,
              title,
              description,
              tag,
              attachment
            }
          ]
        });

        result = await newCalendar.save();
      }

      res.status(200).send(result.deadlines);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to update calendar" });
    }
  }
);

router.delete("/:dashboardId/tasks/:taskId", checkToken, async (req, res) => {
  try {
    const { dashboardId, taskId } = req.params;

    await Calendar.findOneAndUpdate(
      { dashboard: dashboardId },
      { $pull: { deadlines: { task: taskId } } },
      { safe: true, multi: true }
    );

    let calendar = await Calendar.findOne({ dashboard: dashboardId });

    res.status(200).send(calendar.deadlines);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to delete deadline" });
  }
});

router.get("/:dashboardId", checkToken, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const calendar = await Calendar.findOne({ dashboard: dashboardId });

    if (!calendar) {
      res.status(404).json({ error: "Calendar does not exist" });
    }

    res.status(200).send(calendar.deadlines);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to fetch calendar" });
  }
});
module.exports = router;
