const salesService = require("../services/salesService");
const { schema } = require("../schemas/salesSchema");

const getSalesTimeSeries = async (req, res) => {
  try {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const data = await salesService.getTimeSeries(value);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSalesTimeSeries,
};
