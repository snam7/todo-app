const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://namiacam7:todoapp@todo-app.po99v.mongodb.net/'; // Update if using Atlas
mongoose.connect(mongoURI)

.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));

const cors = require('cors');

app.use(cors()); // Allow all origins


// Routes

// Create a Task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Root Route
app.get('/', (req, res) => {
  res.send(`
      <h1>Welcome to the To-Do List App</h1>
      <p>Access the REST API here: <a href="/api">/api</a></p>
  `);
});

// Server Setup
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// REST API Hyperlink Route
app.get('/api', (req, res) => {
  res.send(`
      <h1>Welcome to the To-Do List REST API</h1>
      <p>Use the following endpoints:</p>
      <ul>
          <li><strong>GET</strong> - View all tasks: <a href="/tasks">/tasks</a></li>
          <li><strong>POST</strong> - Create a new task: <code>/tasks</code></li>
          <li><strong>PUT</strong> - Update a task: <code>/tasks/:id</code></li>
          <li><strong>DELETE</strong> - Delete a task: <code>/tasks/:id</code></li>
      </ul>
  `);
});


//mongodb+srv://namiacam7:todoapp@todo-app.po99v.mongodb.net/