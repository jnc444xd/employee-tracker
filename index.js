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

const viewDept = () => {
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