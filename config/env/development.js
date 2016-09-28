module.exports = {
    sessionSecret: 'developmentSessionSecret',
    db: {
        name: "rs-jwt-sequelize-dev",
        username: "root",
        password: "admin",
        host: "localhost",
        dialect: 'mysql',
        port: 3306,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    app: {
        name: "Node JWT Authentication - Development"
    }
};