import { Dialect, Sequelize } from "sequelize";

const dbName: string = 'kinema';
const dbUsername: string = 'root';
const dbPassword: string = 'password';
const host: string = 'localhost';
const dialect: Dialect = 'mysql';

export const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: host,
    dialect: dialect
});

export const connect = async () => {
    return await sequelize.authenticate();
}