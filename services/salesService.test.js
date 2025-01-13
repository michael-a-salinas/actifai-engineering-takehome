const { getTimeSeries } = require("../services/salesService");
const { Sale } = require("../models");
const { mapUserData, mapGroupData } = require("../utils/mappers");

jest.mock("../models", () => ({
  Sale: {
    findAll: jest.fn(),
  },
}));

jest.mock("../utils/mappers", () => ({
  mapUserData: jest.fn((data) => data),
  mapGroupData: jest.fn((data) => data),
}));

describe("getTimeSeries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return time series data grouped by user", async () => {
    const params = {
      interval: "day",
      groupBy: "user",
      aggregate: "total",
      startDate: "2025-01-01",
      endDate: "2025-01-07",
    };

    const mockDbResponse = [
      {
        TO_CHAR: "2025-01-01",
        totalRevenue: 100,
        "User.id": 1,
        "User.name": "John Doe",
        "User.role": "Manager",
      },
    ];

    Sale.findAll.mockResolvedValue(mockDbResponse);

    const result = await getTimeSeries(params);

    expect(Sale.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: expect.arrayContaining([
          expect.arrayContaining([
            expect.objectContaining({ fn: "TO_CHAR" }),
            "day",
          ]),
          expect.arrayContaining([
            expect.objectContaining({ fn: "SUM" }),
            "totalRevenue",
          ]),
        ]),
        include: expect.arrayContaining([
          expect.objectContaining({
            attributes: expect.arrayContaining(["id", "name", "role"]),
            include: expect.arrayContaining([]),
          }),
        ]),
        where: expect.objectContaining({
          date: expect.objectContaining({
            [Symbol.for("between")]: ["2025-01-01", "2025-01-07"],
          }),
        }),
        group: expect.arrayContaining(["day", "User.id"]),
        order: expect.arrayContaining([
          expect.arrayContaining([
            expect.objectContaining({ val: '"day"' }),
            "DESC",
          ]),
          expect.arrayContaining([
            expect.objectContaining({ val: '"totalRevenue"' }),
            "DESC",
          ]),
        ]),
        raw: true,
      })
    );

    expect(mapUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        TO_CHAR: "2025-01-01",
        totalRevenue: 100,
        "User.id": 1,
        "User.name": "John Doe",
        "User.role": "Manager",
      })
    );

    expect(result).toEqual({
      data: mockDbResponse,
      groupBy: "user",
      startDate: "2025-01-01",
      endDate: "2025-01-07",
    });
  });

  it("should return time series data grouped by group", async () => {
    const params = {
      interval: "week",
      groupBy: "group",
      aggregate: "avg",
      startDate: "2021-06-01",
      endDate: "2021-07-01",
    };

    const mockDbResponse = [
      {
        TO_CHAR: "2021-06-28",
        averageRevenue: 75,
        "User.Groups.id": 10,
        "User.Groups.name": "Sales Team",
      },
    ];

    Sale.findAll.mockResolvedValue(mockDbResponse);

    const result = await getTimeSeries(params);

    expect(Sale.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: expect.arrayContaining([
          expect.arrayContaining([
            expect.objectContaining({ fn: "TO_CHAR" }),
            "week",
          ]),
          expect.arrayContaining([
            expect.objectContaining({ fn: "ROUND" }),
            "averageRevenue",
          ]),
        ]),
        include: expect.arrayContaining([
          expect.objectContaining({
            model: undefined,
            attributes: [],
            include: expect.arrayContaining([
              expect.objectContaining({
                model: undefined,
                attributes: ["id", "name"],
                through: expect.objectContaining({
                  attributes: [],
                }),
              }),
            ]),
          }),
        ]),
        where: expect.objectContaining({
          date: expect.objectContaining({
            [Symbol.for("between")]: ["2021-06-01", "2021-07-01"],
          }),
        }),
        group: expect.arrayContaining(["week", "User->Groups.id"]),
        order: expect.arrayContaining([
          expect.arrayContaining([
            expect.objectContaining({ val: '"week"' }),
            "DESC",
          ]),
          expect.arrayContaining([
            expect.objectContaining({ val: '"averageRevenue"' }),
            "DESC",
          ]),
        ]),
        raw: true,
      })
    );

    expect(mapGroupData).toHaveBeenCalledWith(mockDbResponse[0]);
    expect(result).toEqual({
      data: mockDbResponse,
      groupBy: "group",
      startDate: "2021-06-01",
      endDate: "2021-07-01",
    });
  });
});
