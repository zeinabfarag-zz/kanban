const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deadlineSchema = new Schema({
  start: { type: String },
  title: { type: String },
  description: { type: String },
  tag: { type: String },
  column: { type: mongoose.Schema.Types.ObjectId, ref: "Column" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  attachment: [
    {
      url: { type: String },
      name: { type: String }
    }
  ]
});

const calendarSchema = new Schema({
  dashboard: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },
  deadlines: [deadlineSchema]
});

module.exports = mongoose.model("Calendar", calendarSchema);
