const inquirer = require('inquirer');
const { viewDepts, viewRoles, viewByDept, viewByManager, viewEmployees, addDept, addRole, addEmployee, updateEmployee, deleteEmployee, deleteRole, deleteDept, viewBudget } = require('./query');
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
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View Employee by Department', 'View Employee by Manager', 'Delete From Database', 'View Total Utilized Budget by Department']
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
                case 'View Employee by Department':
                    viewByDeptPrompt();
                    break;
                case 'View Employee by Manager':
                    viewByManagerPrompt();
                    break;
                case 'Delete From Database':
                    deletePrompt();
                    break;
                case 'View Total Utilized Budget by Department':
                    budgetPrompt();
                    break;
            }
        });
};

// Functions to populate choices in prompts below

const getEmployees = async () => {
    const employees = await db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`);
    const map = employees[0].map(({ id, name }) => ({ name: name, value: id }))
    return map;
};

const getRoles = async () => {
    const roles = await db.query(`SELECT id, title FROM roles`);
    const map = roles[0].map(({ id, title }) => ({ name: title, value: id }));
    return map;
};

const getManagers = async () => {
    const managers = await db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`);
    const map = managers[0].map(({ id, name }) => ({ name: name, value: id }));
    map.push({ name: 'None', value: null });
    return map;
};

const getDepts = async () => {
    const depts = await db.query(`SELECT id, name FROM departments`);
    const map = depts[0].map(({ id, name }) => ({ name: name, value: id }));
    return map;
};

// delay function nesting setTimeout inside a promise

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Delete prompts below

const deletePrompt = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'deleteChoice',
                message: 'Delete from:',
                choices: ['Employees', 'Roles', 'Departments']
            }
        ])
        .then(({ deleteChoice }) => {
            switch (deleteChoice) {
                case 'Employees':
                    deleteEmployeePrompt();
                    break;
                case 'Roles':
                    deleteRolePrompt();
                    break;
                case 'Departments':
                    deleteDeptPrompt();
                    break;
            }
        });
};

const deleteEmployeePrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to delete?',
                choices: await getEmployees()
            }
        ])
        .then(async (answers) => {
            await deleteEmployee(answers.employee);
            await console.log('Sucessfully deleted employee.')
            await delay(200);
            await starterPrompt();
        })
};

const deleteRolePrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to delete?',
                choices: await getRoles()
            }
        ])
        .then(async (answers) => {
            await deleteRole(answers.role);
            await console.log('Sucessfully deleted role.')
            await delay(200);
            await starterPrompt();
        })
};

const deleteDeptPrompt = async () => {

    const getDeptsNoNull = async () => {
        const depts = await db.query(`SELECT id, name FROM departments`);
        const map = depts[0].map(({ id, name }) => ({ name: name, value: id }));
        return map;
    };

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'Which department would you like to delete?',
                choices: await getDeptsNoNull()
            }
        ])
        .then(async (answers) => {
            await deleteDept(answers.dept);
            await console.log('Sucessfully deleted department.')
            await delay(200);
            await starterPrompt();
        })
};

// Prompt to view total utilized budget by department below

const budgetPrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'dept',
                message: "Which department's total utilized budget would you like to view?",
                choices: await getDepts()
            }
        ])
        .then(async (answers) => {
            await viewBudget(answers.dept);
            await delay(200);
            await starterPrompt();
        })
};

// Employee Prompts below

const viewByDeptPrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department's employees would you like to view?",
                choices: await getDepts()
            }
        ])
        .then( async (answers) => {
            await viewByDept(answers.department);
            await delay(200);
            await starterPrompt();
        });
};

const viewByManagerPrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: "Which managers's employees would you like to view?",
                choices: await getManagers()
            }
        ])
        .then( async (answers) => {
            await viewByManager(answers.manager);
            await delay(200);
            await starterPrompt();
        });
};

const addEmployeePrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What the employee's first name?",
                validate: (firstName) => {
                    if (firstName) {
                        return true
                    } else {
                        console.log('Must enter a first name.')
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What the employee's last name?",
                validate: (lastName) => {
                    if (lastName) {
                        return true
                    } else {
                        console.log('Must enter a last name.')
                    }
                }
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
            const firstName = answers.firstName;
            const lastName = answers.lastName;
            addEmployee(answers.firstName, answers.lastName, answers.role, answers.manager);
            console.log(`Successfully added ${firstName} ${lastName} to the company database.`);
            starterPrompt();
        });
};

const updateRolePrompt = async () => {

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
            },
            {
                type: 'list',
                name: 'manager',
                message: "Which manager would you like to assign?",
                choices: await getManagers()
            }
        ])
        .then((answers) => {
            // const employeeName = answers.employee.name;
            updateEmployee(answers.employee, answers.role, answers.manager);
            console.log(`Successfully updated employee's role in company database.`);
            starterPrompt();
        });
};

// Role prompt below

const addRolePrompt = async () => {

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: "What is the name of the role?",
                validate: (role) => {
                    if (role) {
                        return true
                    } else {
                        console.log('Must enter a role name.')
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?",
                validate: (salary) => {
                    if (salary) {
                        return true
                    } else {
                        console.log('Must enter a valid salary number.')
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: "Which department does this role belong to?",
                choices: await getDepts()
            }
        ])
        .then((answers) => {
            const newRole = answers.role;
            addRole(answers.role, answers.salary, answers.department);
            console.log(`Successfully added ${newRole} to the company database.`);
            starterPrompt();
        });
};

// Department prompt below

const addDeptPrompt = () => {

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept',
                message: "What is the name of the department?",
                validate: (dept) => {
                    if (dept) {
                        return true
                    } else {
                        console.log('Must enter a department name.')
                    }
                }
            }
        ])
        .then((answers) => {
            const newDept = answers.dept;
            addDept(answers.dept);
            console.log(`Successfully added ${newDept} to the company database.`);
            starterPrompt();
        });
};

module.exports = { starterPrompt };