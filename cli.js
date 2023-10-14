const inquirer = require('inquirer');
const { viewDepts, viewRoles, viewEmployees, addDept, addRole, addEmployee, updateEmployee } = require('./sql');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password213',
        database: 'company_db'
    },
    console.log(`Connected to the company_db.`)
);

const starterPrompt = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'landing',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
            },
        ])
        .then(({ landing }) => {
            switch (landing) {
                case 'View All Employees': viewEmployees();
                break;
                case 'Add Employee': addEmployeePrompt();
                break;
                // case 'Update Employee Role': updateEmployee();
                break;
                case 'View All Roles': viewRoles();
                break;
                // case 'Add Role': addRole();
                break;
                case 'View All Departments': viewDepts();
                break;
                // case 'Add Department': addDept();
                break;
            }
        });
};

const addEmployeePrompt = () => {

    const getRoles = () => {
       db.query(`SELECT title AS name FROM roles`)
    };

    const getManagers = () => {
        db.query(`SELECT CONCAT(first_name, " ", last_name) AS name FROM employees`)
     };

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What the employee's first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What the employee's last name?"
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: getRoles()
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: getManagers()
            }
        ])
        .then(({ firstName, lastName, role, manager }) => {
            addEmployee(firstName, lastName, role, manager)
        })
        .then(() => starterPrompt())
};

module.exports = { starterPrompt };