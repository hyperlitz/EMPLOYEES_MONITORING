const db = require('./db');

// Function to retrieve all departments
function getAllDepartments() {
  return db.execute('SELECT * FROM department');
}

// Function to add a new department
function addDepartment(name) {
  return db.execute('INSERT INTO department (name) VALUES (?)', [name]);
}

// Function to get the budget of a department
function getDepartmentBudget(departmentId) {
  return db.execute('SELECT SUM(salary) AS department_budget FROM role WHERE department_id = ?', [departmentId]);
}

// Function to delete a department by department ID
function deleteDepartment(departmentId) {
  return db.execute('DELETE FROM department WHERE id = ?', [departmentId]);
}

module.exports = {
  getAllDepartments,
  addDepartment,
  deleteDepartment,
};