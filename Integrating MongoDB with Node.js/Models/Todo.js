const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    default: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;

// name: {
//         type: String,
//       },
//       age: {
//         type: Number,
//         default: 18,
//         min: 18,
//         max: 60,
//       },
//       email: {
//         type: String,
//         unique: true, // add a specific email
//       },
//       password: {
//         type: String,
//         required: true,
//       },
//       date: {
//         type: Number,
//         default: Date.now,
//       },
