import { Request, Response, NextFunction } from 'express';
import * as WalletService from '../services/wallet.service';
import mongoose from 'mongoose';

export const getWalletBalance = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const result = await WalletService.getWalletBalance(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getWalletDetails = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const result = await WalletService.getWalletDetails(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const { page = '1', limit = '10', type } = req.query;
    const result = await WalletService.getTransactionHistory(
        userId,
      parseInt(page as string),
      parseInt(limit as string),
      type as string
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const fundWallet = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const { amount } = req.body;
    const result = await WalletService.initiateFunding(userId, amount);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const transferFunds = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const { email, amount, description } = req.body;
    const result = await WalletService.transferFunds(userId, email, amount, description);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const withdrawFunds = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req?.user!._id);
    const { amount, bank, accountNumber } = req.body;
    const result = await WalletService.withdrawFunds(userId, amount, bank, accountNumber );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};