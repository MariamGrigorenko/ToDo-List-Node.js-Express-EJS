// * Express *
const express = require("express");
const app = express();

// * Body Parser *
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//  * Consts *
const port = process.env.PORT || 4000;

// * Variables *
let tasks = [];
let workTasks = [];

// * EJS *
// Should be placed after "const app = express()"
app.set("view engine", "ejs");

// * Static Folder *
app.use(express.static(__dirname + "/public"));

// *
app.get("/", (req, res) => {
  const day = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  let currentDate = day.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: currentDate, newTasks: tasks, route: "/" });
});

// *
app.post("/", (req, res) => {
  let addedTask = req.body.newTask;
  tasks.push(addedTask);
  res.redirect("/");
});

//*
app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work List",
    newTasks: workTasks,
    route: "/work",
  });
});

// *
app.post("/work", (req, res) => {
  addedTask = req.body.newTask;
  workTasks.push(addedTask);
  res.redirect("/work");
});

// * Porting our server *
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

// ! very helpful: npx kill-port 3000 8000
