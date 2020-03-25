const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();

const userRouter = require("./routes/user");
const dashboardRouter = require("./routes/dashboard");
const calendarRouter = require("./routes/calendar");
const fileRouter = require("./routes/file");

const { json, urlencoded } = express;
const PORT = process.env.PORT || "3001";

const app = express();
require("./database");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/dashboards", dashboardRouter);
app.use("/calendar", calendarRouter);
app.use("/file", fileRouter);

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
