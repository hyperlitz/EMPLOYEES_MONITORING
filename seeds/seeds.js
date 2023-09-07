const { addRole } = require('../models/role');
const { addDepartment } = require('../models/department');
const { addEmployee } = require('../models/employee');
const db = require('../models/db');

const seedDatabase = async () => {
  try {
    // Sample department data
    const departments = [
      { name: 'Engineering Department' },
      { name: 'Sales Department' },
      { name: 'Marketing Department' },
      { name: 'Management Department' },
    ];

    // Sample role data
    const roles = [
      { title: 'Software Engineer', salary: 100000, department_id: 1 },
      { title: 'Sales Manager', salary: 80000, department_id: 2 },
      { title: 'Marketing Coordinator', salary: 60000, department_id: 3 },
      { title: 'Manager', salary: 70000, department_id: 4 },
    ];

    // Sample employee data with managers
    const employees = [
      { first_name: 'Jane', last_name: 'Smith', role_id: 1, manager_id: 1 },
      { first_name: 'Bob', last_name: 'Johnson', role_id: 2, manager_id: 1 },
      { first_name: 'Alice', last_name: 'Brown', role_id: 3, manager_id: 1 },
      { first_name: 'Eva', last_name: 'Lee', role_id: 1, manager_id: 2 },
      { first_name: 'Mike', last_name: 'Wilson', role_id: 1, manager_id: 2 },
      { first_name: 'Tom', last_name: 'Johnson', role_id: 2, manager_id: 3 },
      { first_name: 'Sara', last_name: 'White', role_id: 2, manager_id: 3 },
      { first_name: 'Emily', last_name: 'Davis', role_id: 3, manager_id: 4 },
      { first_name: 'Mark', last_name: 'Miller', role_id: 3, manager_id: 4 },
    ];

    // Insert departments
    for (const department of departments) {
      await addDepartment(department.name);
    }

    // Insert roles
    for (const role of roles) {
      await addRole(role.title, role.salary, role.department_id);
    }

    // Insert employees
    for (const employee of employees) {
      await addEmployee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id);
    }

    // Sample manager data
    const managers = [
      { first_name: 'Bill', last_name: 'Gates', role_id: 4, manager_id: 1, department_id: 4 },
      { first_name: 'Elon', last_name: 'Musk', role_id: 4, manager_id: 2, department_id: 1 },
      { first_name: 'Mark', last_name: 'Zuckerberg', role_id: 4, manager_id: 3, department_id: 2 },
      { first_name: 'Steve', last_name: 'Jobs', role_id: 4, manager_id: 4, department_id: 3 },
    ];

    // Insert managers
    for (const manager of managers) {
      // If a manager doesn't have a manager, set manager_id to null
      const managerId = manager.manager_id ? manager.manager_id : null;
      await addEmployee(manager.first_name, manager.last_name, manager.role_id, managerId, manager.department_id);
    }

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    db.end();
  }
};

seedDatabase();