const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  status: {
    type: String,
    default: 'OPEN', // Set the default status to "OPEN"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
  deadline: Date,
});

module.exports = mongoose.model('Task', taskSchema);