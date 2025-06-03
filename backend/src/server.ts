import "express-async-errors";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/data-source";
import { materialRoutes } from "./routes/material.routes";
import { purchaseRoutes } from "./routes/purchase.routes";
import { saleRoutes } from "./routes/sale.routes";
import { companyRoutes } from "./routes/company.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { authenticateMiddleware } from "./middlewares/authenticateMiddleware";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Authentication routes (public)
app.use("/api/auth", authRoutes);

// Apply authentication middleware to all other routes
app.use("/api/*", authenticateMiddleware);

// Protected routes
app.use("/api/companies", companyRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    }); 