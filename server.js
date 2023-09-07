const inquirer = require('inquirer');
const {addRole,} = require('./models/role');
const {deleteDepartment,getDepartmentBudget,} = require('./models/department');
const {addEmployee,updateEmployeeRole,deleteEmployee,} = require('./models/employee');
const db = require('./models/db');


async function getManagers() {
  try {
    const [managers] = await db.execute('SELECT * FROM employee WHERE role_id = 4');
    return managers;
  } catch (error) {
    throw error;
  }
}

async function deleteRole(roleId) {
  try {
    // Check if there are employees with the role you want to delete
    const [employees] = await db.execute('SELECT * FROM employee WHERE role_id = ?', [roleId]);

    if (employees.length > 0) {
      // Handle the case where employees have this role
      console.log('Cannot delete the role because there are employees assigned to it.');
      // You can choose to update their roles or display an error message.
    } else {
      // No employees have this role, safe to delete
      await db.execute('DELETE FROM role WHERE id = ?', [roleId]);
      console.log('Role deleted successfully!');
    }
  } catch (error) {
    throw error;
  }
}


async function getAllEmployees() {
  try {
    const [employees] = await db.execute('SELECT id, first_name, last_name FROM employee WHERE role_id != 4');
    return employees;
  } catch (error) {
    throw error;
  }
}


// Function to delete a department and its associated roles by department ID
async function deleteDepartmentAndRoles(departmentId) {
  try {
    // Find all role IDs associated with the department
    const [roleIds] = await db.execute('SELECT id FROM role WHERE department_id = ?', [departmentId]);

    // Delete employees associated with the roles and update their manager to null
    for (const { id: roleId } of roleIds) {
      await db.execute('UPDATE employee SET manager_id = NULL WHERE role_id = ?', [roleId]);
      await db.execute('DELETE FROM employee WHERE role_id = ?', [roleId]);
    }

    // After deleting employees, delete the roles associated with the department
    await db.execute('DELETE FROM role WHERE department_id = ?', [departmentId]);

    // Finally, delete the department itself
    await db.execute('DELETE FROM department WHERE id = ?', [departmentId]);
  } catch (error) {
    throw error;
  }
}

async function getEmployeesByManagerId(managerId) {
  try {
    const [employees] = await db.execute(
      'SELECT * FROM employee WHERE manager_id = ? AND role_id != 4',
      [managerId]
    );
    return employees;
  } catch (error) {
    throw error;
  }
}

async function getAllDepartments() {
  try {
    const [departments] = await db.execute('SELECT * FROM department;');
    console.table(departments);
    return departments;
  } catch (error) {
    throw error;
  }
}

// Function to add a new department
async function addDepartment(name) {
  try {
    const [result] = await db.execute('INSERT INTO department (name) VALUES (?)', [name]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

async function getAllRoles() {
  try {
    const [roles] = await db.execute('SELECT * FROM role');
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    return roleChoices;
  } catch (error) {
    throw error;
  }
}
async function getAllRole() {
  try {
    const [roles] = await db.execute('SELECT * FROM role');
    return roles;
  } catch (error) {
    throw error;
  }
}


async function deleteRolePrompt() {
  try {
    // Get all roles
    const roles = await getAllRoles();
    
    // Check if there are roles to delete
    if (roles.length === 0) {
      console.log('No roles available for deletion.');
      return;
    }

    // Create a list of role choices
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Prompt the user to select a role to delete
    const selectedRoleToDelete = await inquirer.prompt({
      type: 'list',
      name: 'roleId',
      message: 'Select a role to delete:',
      choices: roleChoices,
    });

    // Delete the selected role
    await deleteRole(selectedRoleToDelete.roleId);
    console.log('Role deleted successfully!');
  } catch (error) {
    console.error('Error deleting role:', error);
  }
}


async function startApp() {
  console.log('Welcome to the Employee Monitoring APP!\n');

  while (true) {
    const menuChoice = await inquirer.prompt({
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'Add a department',
        'View all roles',
        'Add a role',
        'View all employees',
        'Add an employee',
        'Update an employee role',
        'View employees by manager',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View department budget',
        'Exit',
      ],
    });

    switch (menuChoice.menu) {
      case 'View all departments':
        try {
          const [departments] = await getAllDepartments();
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
        break;

        case 'Add a department':
          try {
            const departmentData = await inquirer.prompt({
              type: 'input',
              name: 'name',
              message: 'Enter the name of the department:',
            });
        
            const departmentId = await addDepartment(departmentData.name);
        
            if (departmentId) {
              console.log(`Department added successfully with ID: ${departmentId}`);
            } else {
              console.log('Department could not be added.');
            }
          } catch (error) {
            console.error('Error adding department:', error);
          }
          break;
        

      case 'View all roles':
        try {
          const roles = await getAllRole()
          console.table(roles);
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
        break;

      case 'Add a role':
        try {
          // Prompt for role details
          const roleData = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Enter the title of the role:',
            },
            {
              type: 'number',
              name: 'salary',
              message: 'Enter the salary for this role:',
              validate: (input) => {
                if (!isNaN(input) && input >= 0) {
                  return true;
                } else {
                  return 'Please enter a valid salary (a non-negative number).';
                }
              },
            },
            {
              type: 'number',
              name: 'department_id',
              message: 'Enter the department ID for this role:',
              validate: (input) => {
                if (!isNaN(input) && input > 0) {
                  return true;
                } else {
                  return 'Please enter a valid department ID (a positive number).';
                }
              },
            },
          ]);
          await addRole(roleData.title, roleData.salary, roleData.department_id);
          console.log('Role added successfully!');
        } catch (error) {
          console.error('Error adding role:', error);
        }
        break;

        case 'View all employees':
          try {
            const employees = await getAllEmployees();
            if (employees.length === 0) {
              console.log('No employees found.');
            } else {
              console.table(employees);
            }
          } catch (error) {
            console.error('Error fetching employees:', error);
          }
          break;
          
      case 'Add an employee':
        try {
          // Prompt for employee details
          const employeeData = await inquirer.prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter the first name of the employee:',
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'Enter the last name of the employee:',
            },
            {
              type: 'number',
              name: 'role_id',
              message: 'Enter the role ID for this employee:',
              validate: (input) => {
                if (!isNaN(input) && input > 0) {
                  return true;
                } else {
                  return 'Please enter a valid role ID (a positive number).';
                }
              },
            },
            {
              type: 'number',
              name: 'manager_id',
              message: 'Enter the manager ID for this employee (or leave blank for no manager):',
              validate: (input) => {
                if (input === '' || (!isNaN(input) && input > 0)) {
                  return true;
                } else {
                  return 'Please enter a valid manager ID (a positive number) or leave it blank.';
                }
              },
            },
          ]);
          await addEmployee(
            employeeData.first_name,
            employeeData.last_name,
            employeeData.role_id,
            employeeData.manager_id || null
          );
          console.log('Employee added successfully!');
        } catch (error) {
          console.error('Error adding employee:', error);
        }
        break;

        case 'Update an employee role':
          try {
            // Prompt the user to select an employee to update
            const employeesToUpdate = await getAllEmployees();
            const employeeChoices = employeesToUpdate.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            }));
            const selectedEmployee = await inquirer.prompt({
              type: 'list',
              name: 'employeeId',
              message: 'Select an employee to update their role:',
              choices: employeeChoices,
            });
        
            // Prompt for the new role ID
            const newRoleId = await inquirer.prompt({
              type: 'number',
              name: 'newRoleId',
              message: 'Enter the new role ID for this employee:',
              validate: (input) => {
                if (!isNaN(input) && input > 0) {
                  return true;
                } else {
                  return 'Please enter a valid role ID (a positive number).';
                }
              },
            });
        
            // Update the employee's role
            await updateEmployeeRole(selectedEmployee.employeeId, newRoleId.newRoleId);
            console.log('Employee role updated successfully!');
          } catch (error) {
            console.error('Error updating employee role:', error);
          }
          break;
        
      case 'View employees by manager':
        try {
          // Fetch managers with role_id = 4
          const managers = await getManagers();

          if (managers.length === 0) {
            console.log('No managers found.');
          } else {
            const managerChoices = managers.map((manager) => ({
              name: `${manager.first_name} ${manager.last_name}`,
              value: manager.manager_id,
            }));
            const selectedManagerId = await inquirer.prompt({
              type: 'list',
              name: 'managerId',
              message: 'Select a manager to view their employees:',
              choices: managerChoices,
            });
            const managerId = selectedManagerId.managerId;

            const selectedManager = managers.find((manager) => manager.id === managerId);

            if (selectedManager) {
              console.log('Selected Manager:', `${selectedManager.first_name} ${selectedManager.last_name}`);

              const allEmployeesWithSameManager = await getEmployeesByManagerId(managerId);

              if (allEmployeesWithSameManager.length === 0) {
                console.log('No employees found for this manager.');
              } else {
                const employeesToDisplay = allEmployeesWithSameManager.filter(
                  (employee) => employee.role_id !== 4
                );

                if (employeesToDisplay.length === 0) {
                  console.log('No non-manager employees found for this manager.');
                } else {
                  console.log('Selected Manager:', `${selectedManager.first_name} ${selectedManager.last_name}`);
                  console.table(employeesToDisplay, ['id', 'first_name', 'last_name', 'role_id', 'manager_id']);
                }
              }
            } else {
              console.log('Invalid manager selection. Please try again.');
            }
          }
        } catch (error) {
          console.error('Error viewing employees by manager:', error);
        }
        break;

        case 'Delete a department':
        try {
          // Prompt the user to select a department to delete
          const departmentsToDelete = await getAllDepartments();
          const departmentChoices = departmentsToDelete.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          const selectedDepartmentToDelete = await inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to delete:',
            choices: departmentChoices,
          });

          // Delete the selected department and its associated roles
          await deleteDepartmentAndRoles(selectedDepartmentToDelete.departmentId);
          console.log('Department and associated roles deleted successfully!');
        } catch (error) {
          console.error('Error deleting department and roles:', error);
        }
        break;

        case 'Delete a role':
        try {
          // Retrieve roles and wait for the data to be available
          const roleChoices = await getAllRoles();
          
          console.log('Role choices:', roleChoices);

          const selectedRoleToDelete = await inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: 'Select a role to delete:',
            choices: roleChoices,
          });

          // Delete the selected role
          await deleteRole(selectedRoleToDelete.roleId);
          console.log('Role deleted successfully!');
        } catch (error) {
          console.error('Error deleting role:', error);
        }
        break;

        

      case 'Delete an employee':
        try {
          // Prompt the user to select an employee to delete
          const employeesToDelete = await getAllEmployees();
          const employeeDeleteChoices = employeesToDelete.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
          const selectedEmployeeToDelete = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to delete:',
            choices: employeeDeleteChoices,
          });

          // Delete the selected employee
          await deleteEmployee(selectedEmployeeToDelete.employeeId);
          console.log('Employee deleted successfully!');
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
        break;

      case 'Exit':
        console.log('Goodbye!');
        db.end();
        process.exit();
        break;
    }
  }
}

startApp();