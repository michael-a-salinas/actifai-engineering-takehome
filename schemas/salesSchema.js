const joi = require("joi");

const salesSchema = joi.object({
  startDate: joi.date().required().description("Start date (YYYY-MM-DD)"),
  endDate: joi.date().required().description("End date (YYYY-MM-DD)"),
  groupBy: joi
    .string()
    .valid("user", "group")
    .required()
    .description("Defaults to user"),
  aggregate: joi
    .string()
    .valid("avg", "total")
    .required()
    .description("Defaults to total"),
  interval: joi
    .string()
    .valid("day", "week", "month", "year")
    .required()
    .description("Aggregation interval"),
});

module.exports = {
  schema: salesSchema,
};
