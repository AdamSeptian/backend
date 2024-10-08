import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Teams = db.define(
  "teams",{
  name: DataTypes.STRING,
  description: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING},
  {
    freezeTableName: true,
  }
);
export default Teams;