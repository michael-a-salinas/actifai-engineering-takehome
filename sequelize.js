const { Sequelize } = require("sequelize");

// TODO: use env variables
const sequelize = new Sequelize("actifai", "user", "pass", {
  host: "actifai-takehome-db", // process.env.DB_HOST
  dialect: "postgres",
  logging: console.log,
  // logging: false,
});

(async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await sequelize.authenticate();
      console.log("Database connection established successfully.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
