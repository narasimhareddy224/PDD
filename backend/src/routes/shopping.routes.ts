import { Router } from 'express';
import { ShoppingController } from '../controllers/shopping.controller';

const router = Router();

router.get('/search', ShoppingController.searchProducts);
router.get('/compare', ShoppingController.comparePrices);
router.get('/best-price', ShoppingController.getBestPrice);

export default router;
