const Pool = require('pg').Pool;

const pool = new Pool({
    host: "code.cs.uh.edu",
    user: "cosc0189",
    password:"1916029RJ",
    port: "5432",
    database: "COSC3380"
})

module.exports = pool ;