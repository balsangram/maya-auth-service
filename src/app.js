import express from "express";

import corsMiddleware from "./middlewares/cors.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRouter from "./routes/payments.routes.js";
import planRouter from "./routes/plan.routes.js";
import subscriptionRouter from "./routes/subscriptions.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import ApiError from "./utils/ApiError.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* ==============================
   Global Middleware
============================== */

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ==============================
   Health Check
============================== */

app.get("/auth/health", (req, res) => {
  res.json({
    success: true,
    message: "Auth Service API is running",
  });
});

/* ==============================
   API Routes
============================== */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plan", planRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/subscriptions", subscriptionRouter);

/* ==============================
   Swagger Documentation
============================== */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


/* ==============================
   404 Handler
============================== */

app.use((req, res, next) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// IMPORTANT: error middleware must be last
app.use(errorMiddleware);

export default app;
