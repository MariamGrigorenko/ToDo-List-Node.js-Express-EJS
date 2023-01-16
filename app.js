// Express
const express = require("express");
const app = express();

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// EJS (Should be placed after "const app = express()")
app.set("view engine", "ejs");

// Lodash
const lodash = require("lodash");

// Static Folder
app.use(express.static(__dirname + "/public"));

// // Export JS files
// const date = require(__dirname + "/date.js");

//  Port
const port = process.env.PORT || 4000;

// Mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://MariamG:test123@cluster0.eafi9jo.mongodb.net/todolistDB");

const tasksSchema = {
  name: String,
};

const Task = mongoose.model("Task", tasksSchema);

const task0 = new Task({
  name: "Welcome to your todolist!",
});

const task1 = new Task({
  name: "Hit the + button to add a new item.",
});

const task2 = new Task({
  name: "<-- Hit this to delete an item.",
});

const listSchema = {
  name: String,
  tasks: [tasksSchema],
};

const List = mongoose.model("List", listSchema);

// Variables

// Setting the current date and the main route
app.get("/", (req, res) => {
  // let currentDate = date.getDate();
  Task.find({}, (err, foundTasks) => {
    if (foundTasks.length === 0) {
      Task.insertMany([task0, task1, task2], (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success!");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", { listTitle: "Today", newTasks: foundTasks });
    }
  });
});

// Getting and pushing the added tasks from the body of the main route
app.post("/", (req, res) => {
  const addedTask = req.body.newTask;
  const submitedTask = req.body.button;
  const newTask = new Task({
    name: addedTask,
  });
  if (submitedTask === "Today") {
    newTask.save((err, reslut) => {
      res.redirect("/");
    });
  } else {
    List.findOne({ name: submitedTask }, (err, foundList) => {
      foundList.tasks.push(newTask);
      foundList.save((err, result) => {
        res.redirect("/" + submitedTask);
      });
    });
  }
});

app.post("/delete", (req, res) => {
  const checkboxId = req.body.checkbox;
  const submitedTask = req.body.listName;
  if (submitedTask === "Today") {
    Task.findByIdAndRemove(checkboxId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed task!");
        res.redirect("/");
      }
    });
  } else {
    List.findOne({ name: submitedTask }, (err, foundList) => {
      foundList.tasks.pull({ _id: checkboxId });
      foundList.save(() => {
        res.redirect("/" + submitedTask);
      });
    });
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = lodash.capitalize(req.params.customListName);
  if (customListName == "Favicon.ico") return;
  console.log(customListName);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const newList = new List({
          name: customListName,
          tasks: [task0, task1, task2],
        });
        newList.save((err, result) => {
          res.redirect("/" + customListName);
        });
      } else {
        res.render("list", { listTitle: foundList.name, newTasks: foundList.tasks });
      }
    }
  });
});

// Porting our server *
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

// * Very helpful: npx kill-port 3000 8000
