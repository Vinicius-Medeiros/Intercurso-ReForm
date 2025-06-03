import { Router, Request, Response } from 'express';
import { SaleController } from "../controllers/sale.controller";

const router = Router();
const saleController = new SaleController();

router.post('/', async (req: Request, res: Response) => {
    await saleController.createSale(req, res);
});
router.get('/', async (req: Request, res: Response) => {
    await saleController.getAllSales(req, res);
});
router.get('/:id', async (req: Request, res: Response) => {
    await saleController.getSaleById(req, res);
});
router.put('/:id', async (req: Request, res: Response) => {
    await saleController.updateSale(req, res);
});
router.patch('/:id/status', async (req: Request, res: Response) => {
    await saleController.updateSaleStatus(req, res);
});
router.delete('/:id', async (req: Request, res: Response) => {
    await saleController.deleteSale(req, res);
});

export { router as saleRoutes }; 