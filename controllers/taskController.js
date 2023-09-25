const Task = require('../models/Task');

async function createTask(req, res) {
    try {
      const { title, description, status } = req.body;
      const task = new Task({ title, description, status });
      await task.save();
      res.status(201).json({ status: 'SUCCESS', data: {task} });
    } catch (error) {
      console.error(error);
      res.status(500).json({  status: 'ERROR',error: 'Error while saving the data' });
    }
  }
  
  async function updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const { title, description, status } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { title, description, status },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({  status: 'ERROR',error: 'Task not found' });
      }
      res.json({status: 'SUCCESS', data: {updatedTask}});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'ERROR', error: 'Server error' });
    }
  }
  
  async function getAllTasks(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const dateParam = req.query.date; // Date parameter in ISO format (e.g., '2023-09-25')
    
        const skip = (page - 1) * limit;
        const query = {};
    
        if (dateParam) {
          // If a date parameter is provided, filter tasks by date
          const startDate = new Date(dateParam);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1); // Next day
          query.createdAt = { $gte: startDate, $lt: endDate };
        }
    
        const tasks = await Task.find(query)
          .skip(skip)
          .limit(limit);
    
        // Group tasks by status for each day
        const taskCountsByStatus = {};
        tasks.forEach((task) => {
          const taskDate = task.createdAt.toISOString().split('T')[0]; // Extract date (YYYY-MM-DD)
          const taskStatus = task.status;
    
          if (!taskCountsByStatus[taskDate]) {
            taskCountsByStatus[taskDate] = {};
          }
    
          if (!taskCountsByStatus[taskDate][taskStatus]) {
            taskCountsByStatus[taskDate][taskStatus] = 0;
          }
    
          taskCountsByStatus[taskDate][taskStatus]++;
        });
    
        res.json({
          status: "SUCCESS",
          taskCountsByStatus: taskCountsByStatus,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status:"ERROR", error: 'Server error' });
      }
  }
  
  module.exports = { createTask, updateTask, getAllTasks };