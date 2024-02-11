const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
require("dotenv").config();

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to Mongo DB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server running on port", port);
});

const Task = require("./models/task");

//endpoint for savng of a task
app.post("/save", (req, res) => {
  const { name, descr, isImportant } = req.body;

  //create a new task object
  const newTask = new Task({ name, descr, isImportant });

  //save the task to the database
  newTask
    .save()
    .then(() => {
      res.status(200).json({ message: "Task was saved successfully" });
    })
    .catch((err) => {
      console.log("Error registrating user", err);
      res.status(500).json({ message: "Error saving a task!" });
    });
});

//endpoint for getting list of tasks
app.get("/get", (req, res) => {
  //get the tasks from the database
  Task.find({})
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.log("Error registrating user", err);
      res.status(500).json({ message: "Error saving a task!" });
    });
});

//endpoint for deleting a task
app.delete("/tasksDelete/:id", (req, res) => {
  const taskId = req.params.id;
  // Delete the task from the database
  Task.deleteOne({ _id: taskId })
    .then(() => {
      res.status(200).json({ message: "Task deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: "Error deleting task" });
    });
});

//endpoint for getting a specific task
app.get("/getTask/:id", (req, res) => {
  const taskId = req.params.id;
  // get single task from the database
  Task.findOne({ _id: taskId })
    .then((task) => {
      res.status(200).json(task);
    })
    .catch((err) => {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: "Error getting task" });
    });
});

//endpoint for updating a specific task
app.post("/tasks/:id/update", (req, res) => {
  const taskId = req.params.id;
  const { name, descr, isImportant } = req.body;

  const query = { _id: taskId };
  const update = { $set: { name, descr, isImportant } };

  Task.updateOne(query, update)
    .then(() => {
      res.status(200).json({ message: "Task updated successfully" });
    })
    .catch((err) => {
      console.error("Error updating task:", err);
      res.status(500).json({ message: "Error updating task" });
    });
});

//endpoint for getting important tasks
app.get("/getImportantTasks", (req, res) => {
  // get single task from the database
  Task.find({ isImportant: true })
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: "Error getting task" });
    });
});
