import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.controller';
import { authenticateMiddleware } from '../middlewares/authenticateMiddleware';

const router = Router();
const purchaseController = new PurchaseController();

// All routes require authentication
router.use(authenticateMiddleware);

// Create a new purchase (buyer)
router.post('/', purchaseController.createPurchase.bind(purchaseController));

// Get company's purchases (as buyer or seller)
router.get('/', purchaseController.getCompanyPurchases.bind(purchaseController));

// Seller actions
router.post('/:purchaseId/approve', purchaseController.approvePurchase.bind(purchaseController));
router.post('/:purchaseId/deny', purchaseController.denyPurchase.bind(purchaseController));
router.post('/:purchaseId/cancel', purchaseController.cancelPurchase.bind(purchaseController));
router.post('/:purchaseId/complete', purchaseController.completePurchase.bind(purchaseController));

// Add route to update a purchase by ID
router.patch('/:id', purchaseController.updatePurchase.bind(purchaseController));

export { router as purchaseRoutes }; 