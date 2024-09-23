const { Sequelize } = require("sequelize");
let log = require('stratos-logger');
require("dotenv").config();
const mariadb = require("mariadb")
const pgDB = new Sequelize(process.env.PRIMARY_DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

const mDB = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        dialectModule: mariadb,
        logging: false
    }
);
const initializeDatabase = async () => {
    try {
        await pgDB.authenticate();
        await pgDB.sync();

        await mDB.authenticate();
        await mDB.sync();
    } catch (err) {
        log.error("Database initialization error:", err);
    }
};

initializeDatabase();

module.exports = { pgDB, mDB };
