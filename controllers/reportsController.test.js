const { getSalesTimeSeries } = require("../controllers/reportsController");
const salesService = require("../services/salesService");

jest.mock("../services/salesService");

describe("getSalesTimeSeries - Query String Validation", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return 400 if required query parameters are missing", async () => {
    await getSalesTimeSeries(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.stringContaining("required"),
    });
  });

  test("should return 400 if startDate or endDate are invalid", async () => {
    mockReq.query = {
      interval: "month",
      groupBy: "group",
      aggregate: "avg",
      startDate: "invalid-date",
      endDate: "2025-01-09",
    };

    await getSalesTimeSeries(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.stringContaining(`"startDate" must be a valid date`),
    });
  });

  test("should return 400 if interval is missing", async () => {
    mockReq.query = {
      groupBy: "user",
      aggregate: "avg",
      startDate: "2025-01-01",
      endDate: "2025-01-09",
    };

    await getSalesTimeSeries(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.stringContaining(`"interval" is required`),
    });
  });

  test("should return 400 if groupBy value is unexpected", async () => {
    mockReq.query = {
      interval: "monthly",
      groupBy: "region",
      aggregate: "sales",
      startDate: "2025-01-01",
      endDate: "2025-01-09",
    };

    await getSalesTimeSeries(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: expect.stringContaining(`"groupBy" must be one of [user, group]`),
    });
  });

  test("should not call salesService if validation fails", async () => {
    mockReq.query = {
      interval: "monthly",
      groupBy: "region",
      aggregate: "sales",
      startDate: "2025-01-01",
      endDate: "invalid-date",
    };

    await getSalesTimeSeries(mockReq, mockRes);

    expect(salesService.getTimeSeries).not.toHaveBeenCalled();
  });
});
