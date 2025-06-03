import { Router, Request, Response } from 'express';
import { CompanyController } from "../controllers/company.controller";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware";

const router = Router();
const companyController = new CompanyController();

router.post('/', async (req: Request, res: Response) => {
    await companyController.createCompany(req, res);
});
router.get('/:id', async (req: Request, res: Response) => {
    await companyController.getCompanyById(req, res);
});
router.put('/:id', async (req: Request, res: Response) => {
    await companyController.updateCompany(req, res);
});
router.delete('/:id', async (req: Request, res: Response) => {
    await companyController.deleteCompany(req, res);
});

// Protected routes (require authentication)
router.use(authenticateMiddleware);

// GET /companies - Get all companies (excluding the authenticated one)
router.get('/', companyController.getAllCompaniesExcludingAuthenticated.bind(companyController));

// Add other company related routes as needed
router.get('/:companyId/materials', companyController.getCompanyMaterials.bind(companyController));

export { router as companyRoutes }; 