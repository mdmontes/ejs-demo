const Task = require('../models/Task');

const addTask = (req, res) => {
    // res.send("in addTask");
    console.log(`controller function addTask executed; line 5`)
    res.render('pages/addTask');
};

const createTask = async (req, res) => {
    //  res.send("in createTask");
    try {
      if (req.body.complete) {
        req.body.completed = true;
      }
      const task = await Task.create(req.body);
      console.log(`controller function createTask executed; line 13`)
      req.session.pendingMessage = `The task ${task.name} was created.`;
      res.redirect("/tasks");
    } catch (err) {
      if (err.name === "ValidationError") {
        res.locals.message = Object.values(err.errors)
          .map((item) => item.message)
          .join(", ");
      } else {
        res.locals.message = "Something went wrong.";
      }
      res.render("pages/addTask");
    }
};

const deleteTask = async (req, res) => {
    // res.send("in deleteTask");
    try {
      const task = await Task.findByIdAndDelete(req.params.id)
      console.log(`controller function deleteTask executed; line 36`)
      req.session.pendingMessage = `The task ${task.name} was deleted.`
      res.redirect('/tasks')
    } catch (err) {
      req.session.pendingMessage = 'Something went wrong.'
      res.redirect('/tasks')
    }
};

const editTask = async (req, res) => {
    // res.send("in editTask");
    try {
      const task = await Task.findById(req.params.id)
      console.log(`controller function editTask executed; line 40`)
      res.render('pages/editTask', { task })
  } catch (err) {
      req.session.pendingMessage = 'Something went wrong.'
      res.redirect('/tasks');
  }
};

const updateTask = async (req, res) => {
  //  res.send("in updateTask");
  let task = false;
  try {
    if (req.body.complete) {
      req.body.completed = true;
    }
    task = await Task.findById(req.params.id);
    await Task.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    const updated_task = await Task.findById(req.params.id);
    console.log(`controller function updateTask executed; line 60`)
    req.session.pendingMessage = `The task ${task.name} was updated to ${updated_task.name}.`;
    res.redirect("/tasks");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "Something went wrong.";
    }
    if (task) {
      res.render("pages/editTask", { task });
    } else {
      req.session.pendingMessage = "Something went wrong.";
      res.redirect("/tasks");
    }
  }
};

const getTasks = async (req, res) => {
    // res.send("in getTasks");
    try {
      console.log(`controller function getTask executed, line 80`)
      const tasks = await Task.find();
      res.render("pages/tasks", { tasks });
    } catch (err) {
      res.locals.message = "Something went wrong.";
      res.render("pages/tasks", { tasks: [] });
    }
}

module.exports = {
    addTask,
    createTask,
    deleteTask,
    updateTask,
    editTask,
    getTasks
};