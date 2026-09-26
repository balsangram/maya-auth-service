import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // Auth service connects to DB
    await connectDB();

    server = http.createServer(app);

    server.listen(env.PORT, "0.0.0.0", () => {
      console.log(`🔐 Auth Service running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("UNHANDLED REJECTION!", reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("Auth Service terminated.");
    });
  }
});

startServer();