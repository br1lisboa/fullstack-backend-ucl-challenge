import "reflect-metadata";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import pinoHttp from "pino-http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { initializeDatabase } from "./src/shared/infrastructure/database.js";
import { registerRoutes } from "./src/shared/infrastructure/routes.js";
import { registerSwagger } from "./src/shared/infrastructure/swagger.js";
import { logger } from "./src/shared/infrastructure/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();

// view engine setup
app.set("view engine", "jade");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Initialize database connection
initializeDatabase();

// Register application routes
registerRoutes(app);

// Register Swagger documentation
registerSwagger(app);

export default app;
