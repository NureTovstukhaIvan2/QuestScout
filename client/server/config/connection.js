const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      process.env.DB_NAME || "quest_scout",
      process.env.DB_USER || "root",
      process.env.DB_PASSWORD || "123123",
      {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
      }
    );

module.exports = sequelize;
