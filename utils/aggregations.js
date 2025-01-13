const sequelize = require("../sequelize");

const buildAggregation = (aggregate, column) =>
  sequelize.fn(aggregate === "avg" ? "AVG" : "SUM", sequelize.col(column));

const roundAggregationResult = (valueToRound, precision) =>
  sequelize.fn("ROUND", valueToRound, precision);

module.exports = { buildAggregation, roundAggregationResult };
