const inquirer = require('inquirer');
const { viewDepts, viewRoles, viewEmployees, addDept, addRole, addEmployee, updateEmployee } = require('./sql');

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
    return inquirer
        .prompt([
            {
                type: '',
                name: '',
                message: ''
            }
        ])
};

module.exports = { starterPrompt };