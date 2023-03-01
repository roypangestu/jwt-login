import { DataTypes } from "sequelize";
import db from "../config/database.js";

const userModels = db.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [5, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 100],
      },
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    sync: { force: true },
  }
);
export default userModels;
