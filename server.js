"use strict";

const express = require("express");
const seeder = require("./seed");
const swaggerUi = require("swagger-ui-express");
const { swaggerDocs } = require("./schemas/config");
const reportsController = require("./controllers/reportsController");

// Constants
const PORT = 3000;
const HOST = "0.0.0.0";

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // App
  const app = express();

  // Health check
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Returns hello world
   *     responses:
   *       200:
   *         description: Hello world
   */
  app.get("/health", (req, res) => {
    res.send("Hello World");
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Write your endpoints here
  app.get("/api/v1/sales/time-series", reportsController.getSalesTimeSeries);

  app.listen(PORT, HOST);
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
