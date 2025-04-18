import { WalletModel } from '../models/wallet.model';
import { TransactionModel } from '../models/transaction.model';
import { UserModel } from '../models/user.model';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { generatePaymentLink } from '../utils/paystack';

export const getWalletBalance = async (userId: mongoose.Types.ObjectId) => {
  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new Error('Wallet not found');
  return { balance: wallet.balance };
};

export const getWalletDetails = async (userId: mongoose.Types.ObjectId) => {
  const wallet = await WalletModel.findOne({ user: userId }).populate('user');
  if (!wallet) throw new Error('Wallet not found');
  return wallet;
};

export const getTransactionHistory = async (userId: mongoose.Types.ObjectId, page = 1, limit = 10, type?: string) => {
  const query: any = {
    $or: [{ sender: userId }, { receiver: userId }],
  };
  if (type) query.type = type.toUpperCase();
  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    TransactionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    TransactionModel.countDocuments(query),
  ]);
  return {
    data: transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const initiateFunding = async (userId: mongoose.Types.ObjectId, amount: number) => {
  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new Error('Wallet not found');
  const reference = uuidv4();
  const paymentLink = await generatePaymentLink({ amount, reference, email: wallet.user.email });
  await TransactionModel.create({
    reference,
    type: 'FUND',
    amount,
    status: 'PENDING',
    receiver: userId,
  });
  return { paymentLink };
};

export const transferFunds = async (senderId: mongoose.Types.ObjectId, receiverEmail: string, amount: number) => {
  const senderWallet = await WalletModel.findOne({ user: senderId });
  const receiverUser = await UserModel.findOne({ email: receiverEmail });
  const receiverWallet = receiverUser && await WalletModel.findOne({ user: receiverUser._id });
  if (!senderWallet || !receiverUser || !receiverWallet) throw new Error('User or wallet not found');
  if (senderWallet.balance < amount) throw new Error('Insufficient balance');

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  await senderWallet.save();
  await receiverWallet.save();

  const reference = uuidv4();
  await TransactionModel.create({
    reference,
    type: 'TRANSFER',
    amount,
    status: 'SUCCESS',
    sender: senderId,
    receiver: receiverUser._id,
  });
  return { message: 'Transfer successful', reference };
};

export const withdrawFunds = async (userId: mongoose.Types.ObjectId, amount: number) => {
  const MIN_AMOUNT = 1000;
  const WITHDRAW_FEE = 50;
  if (amount < MIN_AMOUNT) throw new Error('Minimum withdrawal is ₦1000');
  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new Error('Wallet not found');
  const totalAmount = amount + WITHDRAW_FEE;
  if (wallet.balance < totalAmount) throw new Error('Insufficient balance');
  wallet.balance -= totalAmount;
  await wallet.save();
  const reference = uuidv4();
  await TransactionModel.create({
    reference,
    type: 'WITHDRAW',
    amount,
    status: 'SUCCESS',
    sender: userId,
  });
  return { message: 'Withdrawal successful', reference };
};
