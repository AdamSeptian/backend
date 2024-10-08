import { Sequelize } from "sequelize";

const db = new Sequelize('ecaku', 'root', '', {
    host: "localhost",
    dialect: "mysql",
})

export default db