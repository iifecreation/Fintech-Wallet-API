// routes/wallet.routes.ts
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getWalletBalance,
  getTransactions,
  fundWallet,
  transferFunds,
  withdrawFunds,
  getWalletDetails,
} from '../controllers/wallet.controller';

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', getWalletBalance);
router.get('/details', getWalletDetails);
router.get('/transactions', getTransactions);
router.post('/fund', fundWallet);
router.post('/transfer', transferFunds);
router.post('/withdraw', withdrawFunds);

export default router;