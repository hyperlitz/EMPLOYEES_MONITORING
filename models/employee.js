const db = require('./db');

// Function to retrieve employees by manager's ID, excluding managers (role_id = 4)
function getEmployeesByManagerId(managerId) {
  return db.execute('SELECT * FROM employee WHERE manager_id = ? AND role_id != 4', [managerId]);
}


// Function to update an employee's role by employee ID
function updateEmployeeRole(employeeId, newRoleId) {
  return db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
}

// Function to delete an employee by employee ID
function deleteEmployee(employeeId) {
  return db.execute('DELETE FROM employee WHERE id = ?', [employeeId]);
}

// Function to retrieve all employees
function getAllEmployees() {
  return db.execute('SELECT * FROM employee');
}

// Function to add a new employee
function addEmployee(firstName, lastName, roleId, managerId) {
  return db.execute(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
    [firstName, lastName, roleId, managerId]
  );
}

module.exports = {
  getEmployeesByManagerId,
  updateEmployeeRole,
  deleteEmployee,
  getAllEmployees,
  addEmployee,
};