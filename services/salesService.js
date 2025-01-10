const sequelize = require("../sequelize");
const { Sale, User, Group } = require("../models");
const { Op } = require("sequelize");
const {
  buildAggregation,
  roundAggregationResult,
} = require("../utils/aggregations");
const { mapUserData, mapGroupData } = require("../utils/mappers");

async function getTimeSeries(params = {}) {
  const {
    interval = "week",
    groupBy = "user",
    aggregate = "total",
    startDate,
    endDate,
  } = params;

  const aggregationLabel =
    aggregate === "total" ? "totalRevenue" : "averageRevenue";
  const aggregation = buildAggregation(aggregate, "amount");
  const groupByUser = groupBy === "user";
  const groupField = groupByUser ? "User.id" : "User->Groups.id";

  const timeSeriesData = await Sale.findAll({
    attributes: [
      [
        sequelize.fn(
          "TO_CHAR",
          sequelize.fn("DATE_TRUNC", interval, sequelize.col("date")),
          "YYYY-MM-DD"
        ),
        interval,
      ],
      [
        aggregate === "avg"
          ? roundAggregationResult(aggregation, 2)
          : aggregation,
        aggregationLabel,
      ],
    ],
    include: [
      {
        model: User,
        attributes: groupByUser ? ["id", "name", "role"] : [],
        include: groupByUser
          ? []
          : [
              {
                model: Group,
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ],
      },
    ],
    where: { date: { [Op.between]: [startDate, endDate] } },
    group: [interval, groupField],
    order: [
      [sequelize.literal(`"${interval}"`), "DESC"],
      [sequelize.literal(`"${aggregationLabel}"`), "DESC"],
    ],
    raw: true,
  });

  const data = timeSeriesData.map((item) =>
    groupByUser ? mapUserData(item) : mapGroupData(item)
  );
  return {
    groupBy: groupBy,
    startDate,
    endDate,
    data,
  };
}

module.exports = { getTimeSeries };
