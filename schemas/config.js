const swaggerJsDoc = require("swagger-jsdoc");
const j2s = require("joi-to-swagger");
const { salesSchema, salesAggregationSchema } = require("./salesSchema");
// const { func } = require("joi");
const { swagger: salesSchemaSwagger } = j2s(salesSchema);
const { swagger: salesAggregationSchemaSwagger } = j2s(salesAggregationSchema);

const mapSwaggerParameters = (swagger) => {
  return Object.entries(swagger.properties).map(([key, value]) => ({
    name: key,
    in: "query",
    required: swagger.required.includes(key),
    schema: value,
    description: value.description,
  }));
};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ActifAI",
      version: "1.0.0",
      description: "API documentation for ActifAI",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    paths: {
      "/api/v1/sales": {
        get: {
          summary: "Get sales time series data",
          parameters: mapSwaggerParameters(salesSchemaSwagger),
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      startDate: { type: "string" },
                      endDate: { type: "string" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            amount: { type: "integer" },
                            date: { type: "string" },
                            User: {
                              type: "object",
                              properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                role: { type: "string" },
                                Groups: {
                                  type: "object",
                                  properties: {
                                    id: { type: "integer" },
                                    name: { type: "string" },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/sales/time-series": {
        get: {
          summary: "Get aggregated sales time series data",
          parameters: mapSwaggerParameters(salesAggregationSchemaSwagger),
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      groupBy: { type: "string" },
                      startDate: { type: "string" },
                      endDate: { type: "string" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            date: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs };
