/**
 * Load tasks from JSON file named "data/tasks.json"
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function loadTasks(tasks) {
}

/**
 * Save tasks to JSON file named "data/tasks.json"
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function saveTasks(tasks) {
}

/**
 * Load users from JSON file named "data/users.json"
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function loadUsers(users) {
}

/**
 * Save users to JSON file named "data/users.json"
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function saveUsers(users) {
}

/**
 * This function will save logged in user to a file named "data/loggedInUser.json"
 *
 * @param {{username: string, email: string, role: 'ADMIN' | 'USER'}} user
 *     This is the user object that will be saved to the file
 */
function saveLoggedInUser(user) {
}

/**
 * This function will load logged in user from a file named "data/loggedInUser.json"
 * if file does not exist or file is empty it will return null
 *
 * @returns {{username: string, email: string, role: 'ADMIN' | 'USER'} | null} user
 *     This is the user object that will be loaded from the file or null
 *     if file does not exist or file is empty
 */
function loadLoggedInUser() {
}
/////////////////////////////////////////////////////////////////////////

const fs = require("fs");

// Load tasks
function loadTasks(dbFile = "data.json") {
  try {
    if (!fs.existsSync(dbFile)) return [];
    const data = fs.readFileSync(dbFile, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading tasks:", err);
    return [];
  }
}

// Save tasks
function saveTasks(tasks, dbFile = "data.json") {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(tasks, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving tasks:", err);
  }
}

// Load users
function loadUsers(dbFile = "data.json") {
  try {
    if (!fs.existsSync(dbFile)) return [];
    const data = fs.readFileSync(dbFile, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
}

// Save users
function saveUsers(users, dbFile = "data.json") {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

// Save logged in user
function saveLoggedInUser(user, dbFile = "data/loggedInUser.json") {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(user, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving logged in user:", err);
  }
}

// Load logged in user
function loadLoggedInUser(dbFile = "data/loggedInUser.json") {
  try {
    if (!fs.existsSync(dbFile)) return null;
    const data = fs.readFileSync(dbFile, "utf8");
    if (!data.trim()) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading logged in user:", err);
    return null;
  }
}

module.exports = {
  loadTasks,
  saveTasks,
  loadUsers,
  saveUsers,
  saveLoggedInUser,
  loadLoggedInUser,
};

