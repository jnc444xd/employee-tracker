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
).promise();

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

const addEmployeePrompt = async () => {

    const getRoles = async () => {
        const roles = await db.query(`SELECT id, title FROM roles`);
        const map = roles[0].map(({ id, title }) => ({ name: title, value: id }));
        return map;
    };

    const getManagers = async () => {
        const managers = await db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`);
        const map = managers[0].map(({ id, name }) => ({ name: name, value: id }))
        return map;
    };

    let firstName = "";
    let lastName = "";

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
                choices: await getRoles()
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: await getManagers()
            }
        ])
        .then((answers) => {
            firstName = answers.firstName;
            lastName = answers.lastName;
            addEmployee(answers.firstName, answers.lastName, answers.role, answers.manager);
        })
        .then(() => {
            console.log(`Successfully added ${firstName} ${lastName} to the database.`)
        })
        .then(() => starterPrompt())
};

module.exports = { starterPrompt };