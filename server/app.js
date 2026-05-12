const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const client = require("prom-client");
const logger = require("./config/logger");
const app = express();
const routes = require("./routes");

// ==============================================================================
// Prometheus Metrics Setup
// ==============================================================================

// Create a registry for metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// Add custom HTTP request counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "status", "route"],
  registers: [register],
});

// Add custom HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "status", "route"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Initialize external services
(async () => {
  try {
  } catch (error) {
    logger.error("Failed to initialize services:", error);
    process.exit(1);
  }
})();

app.use(cors());

app.use(morgan("dev", { stream: logger.stream }));
app.use(express.json());

// ==============================================================================
// Metrics Middleware
// Track HTTP requests with prom-client
// ==============================================================================
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    // Increment request counter
    httpRequestsTotal.inc({
      method: req.method,
      status: res.statusCode,
      route: route || "unknown",
    });
    
    // Record request duration
    httpRequestDuration.observe({
      method: req.method,
      status: res.statusCode,
      route: route || "unknown",
    }, duration);
  });
  
  next();
});

// ==============================================================================
// Prometheus Metrics Endpoint
// Exposes all metrics in Prometheus format
// ==============================================================================
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType());
    res.end(await register.metrics());
  } catch (error) {
    logger.error("Error serving metrics:", error);
    res.status(500).end("Error serving metrics");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

module.exports = app;

