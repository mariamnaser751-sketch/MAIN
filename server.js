// Express Server Entry Point
const express = require('express');
const app = express();
const PORT = 6060;

// Local Database
const {
  loadTasks,
  saveTasks,
  loadUsers,
  saveUsers,
  saveLoggedInUser,
  loadLoggedInUser,
} = require("./db");
/////
const tasks = [];
const users = [];

loadTasks(tasks, "data/tasks.json");
loadUsers(users, "data/users.json");
const loggedInUUser = loadLoggedInUser(users, "data/loggedInUser.json");
// Middleware
app.use(express.json());

// Routes
app.get('/api/tasks', (req, res) => {
       res.json(tasks);
});
//
app.get('/api/tasks/search', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase();
  if (!keyword) return res.status(400).json({ message: "Keyword required" });

  const result = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword)
  );

  res.json(result);
});

// YOU MUST BE LOGGED IN TO DO IT
app.post('/api/tasks', (req, res) => {
     if (!loggedInUser) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: "Missing fields" });
  }

   const task = {
    id: Date.now(), 
    title,
    description,
    priority,
    username: loggedInUser.username,
  };

  tasks.push(task);
  saveTasks(tasks, "data/tasks.json");

  res.status(201).json(task);
});

    saveTasks(tasks, "data/tasks.json");

// YOU MUST BE LOGGED IN TO DO IT OR YOU ARE THE CREATOR OF THE TASK
app.delete('/api/tasks/', (req, res) => {
      if (!loggedInUser) {
    return res.status(401).json({ message: "You must be logged in" });
  }
   const id = parseInt(req.query.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (loggedInUser.role !== "ADMIN" && task.username !== loggedInUser.username) {
    return res.status(403).json({ message: "Not authorized to delete this task" });
  }

  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks, "data/tasks.json");

  res.json({ message: "Task deleted successfully" });
});

    saveTasks(tasks, "data/tasks.json");


app.get("/profile", (req, res)  => {
   const { username, email } = req.query;
  const user = users.find((u) => u.username === username || u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// YOU MUST BE LOGGED IN AND HAVE ADMIN ROLE TO DO IT
app.delete("/profile", (req, res)  => {
   if (!loggedInUser || loggedInUser.role !== "ADMIN") {
    return res.status(403).json({ message: "Only ADMIN can delete users" });
  }

  const { username, email } = req.query;
  const user = users.find((u) => u.username === username || u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  users = users.filter((u) => u.username !== user.username);
  saveUsers(users, "data/users.json");

  res.json({ message: "User deleted successfully" });
});
    saveUsers(users, "data/users.json");

app.post("/register", (req, res)  => {
    const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (users.find((u) => u.username === username || u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { username, email, password, role };
  users.push(newUser);
  saveUsers(users, "data/users.json");

  res.status(201).json(newUser);
});
    saveUsers(users, "data/users.json");


app.post("/login", (req, res)  => {
   
const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username || u.email === username
  );

  if (!user) {
    return res.status(401).json({ message: "User Not Found" });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  saveLoggedInUser(user, "data/loggedInUser.json");
  loggedInUser = user;

  res.json({ message: "Login successful", user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




 //////////////////////////////////////////////////////////////////////////.