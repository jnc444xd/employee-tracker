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

const viewDepts = () => {
    const sql = `SELECT * FROM departments`
    // How to choose correct error message?
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const viewRoles = () => {
    const sql = `SELECT * FROM roles`
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const viewEmployees = () => {
    const sql = `SELECT * FROM employees`

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const addDept = () => {
    const sql = `
    INSERT INTO 
    VALUES
    `

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const addRole = () => {
    const sql = `
    INSERT INTO 
    VALUES
    `

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const addEmployee = () => {
    const sql = `
    INSERT INTO 
    VALUES
    `

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};

const updateEmployee = () => {
    const sql = `
    UPDATE
    SET
    WHERE
    `

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(results);
    });
};