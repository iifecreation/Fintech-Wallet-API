import { Request, Response, NextFunction } from 'express';
import * as WalletService from '../services/wallet.service';

export const getWalletBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletService.getWalletBalance(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getWalletDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WalletService.getWalletDetails(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', type } = req.query;
    const result = await WalletService.getTransactionHistory(
      req.user._id,
      parseInt(page as string),
      parseInt(limit as string),
      type as string
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const fundWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const result = await WalletService.initiateFunding(req?.user._id, amount);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const transferFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, amount } = req.body;
    const result = await WalletService.transferFunds(req.user._id, email, amount);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const withdrawFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const result = await WalletService.withdrawFunds(req.user._id, amount);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};