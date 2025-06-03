import { Router, Request, Response } from 'express';
import { MaterialController } from "../controllers/material.controller";
import { authenticateMiddleware } from "../middlewares/authenticateMiddleware";

const router = Router();
const materialController = new MaterialController();

// Apply authentication middleware to all material routes
router.use(authenticateMiddleware);

router.post('/', async (req: Request, res: Response) => {
    await materialController.createMaterial(req, res);
});
router.get('/', async (req: Request, res: Response) => {
    await materialController.getAllMaterials(req, res);
});
router.get('/:id', async (req: Request, res: Response) => {
    await materialController.getMaterialById(req, res);
});
router.put('/:id', async (req: Request, res: Response) => {
    await materialController.updateMaterial(req, res);
});
router.delete('/:id', async (req: Request, res: Response) => {
    await materialController.deleteMaterial(req, res);
});

export { router as materialRoutes }; 