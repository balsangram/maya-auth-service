import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Maya Friends Auth API",
      version: "1.0.0",
      description: "Auth Service API Documentation",
    },

    servers: [
      {
        url: "http://localhost:7001",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    path.join(__dirname, "../routes/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

console.log(
  "Swagger paths:",
  Object.keys(swaggerSpec.paths || {})
);

export default swaggerSpec;