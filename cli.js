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
                case 'View All Employees':
                    viewEmployees();
                    setTimeout(() => starterPrompt(), 200);
                    break;
                case 'Add Employee':
                    addEmployeePrompt();
                    break;
                case 'Update Employee Role':
                    updateRolePrompt();
                    break;
                case 'View All Roles':
                    viewRoles();
                    setTimeout(() => starterPrompt(), 200);
                    break;
                case 'Add Role':
                    addRolePrompt();
                    break;
                case 'View All Departments':
                    viewDepts();
                    setTimeout(() => starterPrompt(), 200);
                    break;
                case 'Add Department':
                    addDeptPrompt();
                    break;
            }
        });
};

// Need to add checks for errors and validation for inputs
// Do I need return before inquirer prompts? Why?

// Employee Prompts below

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
            console.log(`Successfully added ${firstName} ${lastName} to the company database.`)
        })
        .then(() => starterPrompt())
};

const updateRolePrompt = async () => {

    const getEmployees = async () => {
        const managers = await db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`);
        const map = managers[0].map(({ id, name }) => ({ name: name, value: id }))
        return map;
    };

    const getRoles = async () => {
        const roles = await db.query(`SELECT id, title FROM roles`);
        const map = roles[0].map(({ id, title }) => ({ name: title, value: id }));
        return map;
    };

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices: await getEmployees()
            },
            {
                type: 'list',
                name: 'role',
                message: "Which role would you like to assign?",
                choices: await getRoles()
            }
        ])
        .then((answers) => {
            employee = answers.employee.name;
            updateEmployee(answers.employee, answers.role);
        })
        .then(() => {
            console.log(`Successfully updated employee's role in company database.`)
        })
        .then(() => starterPrompt())
};

// Role prompt below

const addRolePrompt = async () => {

    const getDepts = async () => {
        const depts = await db.query(`SELECT id, name FROM departments`);
        const map = depts[0].map(({ id, name }) => ({ name: name, value: id }));
        return map;
    };

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: "What is the name of the role?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?"
            },
            {
                type: 'list',
                name: 'department',
                message: "Which department does this role belong to?",
                choices: await getDepts()
            }
        ])
        .then((answers) => {
            addRole(answers.role, answers.salary, answers.department);
        })
        .then(() => {
            console.log(`Successfully added the role to the company database.`)
        })
        .then(() => starterPrompt())
};

// Department prompt below

const addDeptPrompt = () => {

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept',
                message: "What is the name of the department?"
            }
        ])
        .then((answers) => {
            addDept(answers.dept);
        })
        .then(() => {
            console.log(`Successfully added the department to the company database.`)
        })
        .then(() => starterPrompt())
};

module.exports = { starterPrompt };