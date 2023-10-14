const mysql = require('mysql2');

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
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const viewRoles = () => {
    const sql = `
    SELECT r.id, r.title, d.name AS department_name, r.salary
    FROM roles r
    LEFT JOIN departments d ON r.department_id = d.id
    `
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const viewEmployees = () => {
    const sql = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary 
    FROM employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id
    `

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
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

const updateEmployee = (employee, role) => {

    const params = [role, employee]

    const sql = `
    UPDATE employees
    SET role_id = ?
    WHERE id = ?
    `

    db.query(sql, params);
};


module.exports = { viewDepts, viewRoles, viewEmployees, addDept, addRole, addEmployee, updateEmployee };