const express = require('express');
const router = express.Router();
const {
  createTask,
  updateTask,
  getAllTasks,
} = require('../controllers/taskController');

// Create Task API
router.post('/tasks', createTask);

// Update Task API
router.put('/tasks/:id', updateTask);

// Get All Tasks API
router.get('/tasks', getAllTasks);

module.exports = router;