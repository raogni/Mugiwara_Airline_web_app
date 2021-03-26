const Pool = require('pg').Pool;

const pool = new Pool({
    host: "loocalhost",
    user: "****",
    password:"*******",
    port: "5432",
    database: "flightsDB"
})

module.exports = pool ;
