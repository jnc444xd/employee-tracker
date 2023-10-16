const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password213',
        database: 'company_db'
    },
);

// Error messages needed?

const viewDepts = () => {

    const sql = `SELECT * FROM departments`

    db.query(sql, (err, results) => {
        console.log('');
        console.table(results);
    });
};

const viewRoles = () => {

    const sql = `
    SELECT r.id, r.title, d.name AS department_name, r.salary
    FROM roles r
    LEFT JOIN departments d ON r.department_id = d.id
    `
    
    db.query(sql, (err, results) => {
        console.log('');
        console.table(results);
    });
};

const viewEmployees = () => {

    const sql = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager_name
    FROM employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
    `

    db.query(sql, (err, results) => {
        console.log('');
        console.table(results);
    });
};

const viewByDept = (dept) => {

    const params = [dept];

    const sql = `
    SELECT e.id AS employee_id, e.first_name, e.last_name, d.name AS department
    FROM employees e
    INNER JOIN roles r ON e.role_id = r.id
    INNER JOIN departments d ON r.department_id = d.id
    WHERE d.id = ?
    ORDER BY e.first_name, e.last_name
    `;

    db.query(sql, params, (err, results) => {
        console.log('');
        console.table(results);
    });
};

const viewByManager = (managerID) => {

    const params = [managerID];

    const sql = `
    SELECT e.id AS employee_id, e.first_name, e.last_name, CONCAT(m.first_name, " ", m.last_name) AS manager_name
    FROM employees e
    INNER JOIN employees m ON e.manager_id = m.id
    WHERE m.id = ?
    ORDER BY e.first_name, e.last_name
    `;

    db.query(sql, params, (err, results) => {
        console.log('');
        console.table(results);
    });
};

const addDept = (dept) => {

    params = [dept]

    const sql = `
    INSERT INTO departments (name)
    VALUES (?)
    `

    db.query(sql, params);
};

const addRole = (role, salary, department) => {

    params = [role, department, salary];

    const sql = `
    INSERT INTO roles (title, department_id, salary)
    VALUES (?, ?, ?)
    `;

    db.query(sql, params);
};

const addEmployee = (first, last, role, manager) => {

    const params = [first, last, role, manager];

    const sql = `
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)
    `;

    db.query(sql, params);
};

const updateEmployee = (employee, role, manager) => {

    const params = [role, manager, employee]

    const sql = `
    UPDATE employees
    SET role_id = ?, manager_id = ?
    WHERE id = ?
    `

    db.query(sql, params);
};

const deleteEmployee = (employee) => {

    const params = [employee]

    const sql = `
    DELETE FROM employees
    WHERE id = ?
    `

    db.query(sql, params);
};

const deleteRole = (role) => {

    const params = [role]

    const sql = `
    DELETE FROM roles
    WHERE id = ?
    `

    db.query(sql, params);
};

const deleteDept = (dept) => {

    const params = [dept]

    const sql = `
    DELETE FROM departments
    WHERE id = ?
    `

    db.query(sql, params);
};

const viewBudget = (dept) => {

    const params = [dept]

    const sql = `
    SELECT d.id AS department_id, d.name AS department_name, SUM(r.salary) AS total_utilized_budget
    FROM employees e
    INNER JOIN roles r ON e.role_id = r.id
    INNER JOIN departments d ON r.department_id = d.id
    WHERE d.id = ?
    GROUP BY d.id, d.name;
    `

    db.query(sql, params, (err, results) => {
        console.log('');
        console.table(results);
    });
};

module.exports = { viewDepts, viewRoles, viewEmployees, viewByDept, viewByManager, addDept, addRole, addEmployee, updateEmployee, deleteEmployee, deleteRole, deleteDept, viewBudget };