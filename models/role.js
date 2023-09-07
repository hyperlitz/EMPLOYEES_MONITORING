const db = require('./db');

// Function to retrieve all roles
function getAllRole() {
  return db.execute('SELECT * FROM role');
}

// Function to add a new role
function addRole(title, salary, departmentId) {
  return db.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

// Function to delete a role by role ID
function deleteRole(roleId) {
  return db.execute('DELETE FROM role WHERE id = ?', [roleId]);
}

// Function to retrieve all roles by department ID
function getRolesByDepartment(departmentId) {
  return db.execute('SELECT * FROM role WHERE department_id = ?', [departmentId]);
}

module.exports = {
  getAllRole,
  addRole,
  deleteRole,
  getRolesByDepartment
};