require("dotenv").config();
const msql = require("mysql2/promise");
const config={
host:process.env.DB_HOST,
user: process.env.DB_USER,
password : process.env.DB_PASSWORD,
database: process.env.DB
};
const createConnection = async () =>{
    return await msql.createConnection(config)      
}

module.exports= {createConnection};