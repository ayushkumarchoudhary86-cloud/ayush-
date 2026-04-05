require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Handles Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// --- RESTful API Endpoints ---

// GET /tasks - Retrieve all tasks (with optional search via query params)
app.get('/tasks', (req, res) => {
    const { search } = req.query;
    let query = "SELECT * FROM tasks ORDER BY created_at DESC";
    let params = [];

    if (search) {
        query = "SELECT * FROM tasks WHERE title LIKE ? ORDER BY created_at DESC";
        params = [`%${search}%`];
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const query = "INSERT INTO tasks (title, is_completed) VALUES (?, 0)";
    db.run(query, [title], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, is_completed: 0 }); // 201 Created
    });
});

// PUT /tasks/:id - Update task status or text
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, is_completed } = req.body;

    const query = "UPDATE tasks SET title = COALESCE(?, title), is_completed = COALESCE(?, is_completed) WHERE id = ?";
    db.run(query, [title, is_completed, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Task not found" }); // 404 Not Found
        res.status(200).json({ message: "Task updated successfully" }); // 200 OK
    });
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";
    
    db.run(query, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});