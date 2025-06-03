import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { AppError } from "../errors/AppError";
import { AppDataSource } from "../config/data-source";
import { Company } from "../entities/Company";
import dotenv from 'dotenv';

dotenv.config();

// Extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: Company; // Attach company object as user
    }
  }
}

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from cookie or Authorization header (prefer cookie as set during login)
        const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);

        if (!token) {
            throw new AppError("No token, authorization denied", 401);
        }

        const jwtSecret = process.env.JWT_SECRET as Secret;
        if (!jwtSecret) {
             throw new AppError("JWT secret not configured", 500);
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // Find the company (user) by ID from the payload
        const companyRepository = AppDataSource.getRepository(Company);
        const company = await companyRepository.findOneBy({ id: decoded.id });

        if (!company) {
            throw new AppError("Company (User) not found", 404);
        }

        // Attach company object to request
        req.user = company;

        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        // Handle token verification errors (e.g., invalid token, expired token)
        if (error instanceof jwt.JsonWebTokenError) {
             return res.status(401).json({ message: 'Token is not valid' });
        }

        // Handle other potential errors during the process
        if (error instanceof AppError) {
             return res.status(error.statusCode).json({ message: error.message });
        }

        console.error("Authentication middleware error:", error);
        return res.status(500).json({ message: 'Server Error' });
    }
}; 