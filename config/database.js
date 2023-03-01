import Sequelize, { Model } from "sequelize";
const db = new Sequelize("user_login", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database not connected!!"));

export default db;
