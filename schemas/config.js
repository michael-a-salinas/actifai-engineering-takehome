const swaggerJsDoc = require("swagger-jsdoc");
const j2s = require("joi-to-swagger");
const { schema: salesSchema } = require("./salesSchema");
const { swagger: revenueSummarySchemaSwagger } = j2s(salesSchema);

// Swagger Config
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
      "/api/v1/sales/time-series": {
        get: {
          summary: "Get sales summary",
          parameters: Object.entries(
            revenueSummarySchemaSwagger.properties
          ).map(([key, value]) => ({
            name: key,
            in: "query",
            required: revenueSummarySchemaSwagger.required.includes(key),
            schema: value,
            description: value.description,
          })),
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
                      data: { type: "object" },
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
