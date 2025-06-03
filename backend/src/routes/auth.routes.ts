import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware"; // Assuming you have an auth middleware

const authRoutes = Router();
const authController = new AuthController();

// POST /auth/register - Register a new company (which is also the user)
authRoutes.post("/register", authController.register.bind(authController));

// POST /auth/login - Login a company (user)
authRoutes.post("/login", authController.login.bind(authController));

// PATCH /auth/change-password - Change password for the logged-in company (user)
// This route requires authentication
authRoutes.patch("/change-password", authenticateMiddleware, authController.changePassword.bind(authController));

// Protected routes
// Apply authentication middleware to routes below this line
authRoutes.use(authenticateMiddleware);

authRoutes.get("/me", authController.getAuthenticatedCompany.bind(authController));
authRoutes.patch("/me", authController.updateAuthenticatedCompany.bind(authController));
authRoutes.get("/dashboard", authController.getDashboardData.bind(authController));

// Add other auth related routes here if needed, e.g., /logout, /forgot-password, etc.

export default authRoutes; 