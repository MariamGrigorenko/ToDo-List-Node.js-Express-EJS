// * Express *
const express = require("express");
const app = express();

// * Body Parser *
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// * Export JS files *
const date = require(__dirname + "/date.js");

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

// * Setting the current date and the main route
app.get("/", (req, res) => {
  let currentDate = date.getDate();
  res.render("list", { listTitle: currentDate, newTasks: tasks, route: "/" });
});

// * Getting and pushing the added tasks from the body of the main route
app.post("/", (req, res) => {
  let addedTask = req.body.newTask;
  tasks.push(addedTask);
  res.redirect("/");
});

//* Setting the work route
app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work List",
    newTasks: workTasks,
    route: "/work",
  });
});

// * Getting and pushing the added tasks from the body of the work route
app.post("/work", (req, res) => {
  addedTask = req.body.newTask;
  workTasks.push(addedTask);
  res.redirect("/work");
});

// * Setting the about route
app.get("/about", (req, res) => {
  res.render("about");
});

// * Porting our server *
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

// ! very helpful: npx kill-port 3000 8000
