-- Drop the 'employee_monitoring_db' database if it exists
DROP DATABASE IF EXISTS employee_monitoring_db;

-- Create the 'employee_monitoring_db' database
CREATE DATABASE IF NOT EXISTS employee_monitoring_db;

-- Use the 'employee_monitoring_db' database
USE employee_monitoring_db;

-- Create the department table
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create the role table
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT,
  manager_id INT, -- Represents the ID of the employee's manager, can be NULL
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);