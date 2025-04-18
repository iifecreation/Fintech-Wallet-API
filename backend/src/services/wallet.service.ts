import { Wallet } from '../models/wallet.model';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { generatePaymentLink } from '../utils/paystack';

export const getWalletBalance = async (userId: mongoose.Types.ObjectId) => {
  const wallet = await Wallet.findOne({ user: userId }).populate({
    path: 'user',
    select: '-password'
  });
  if (!wallet) throw new Error('Wallet not found');
  return { balance: wallet };
};

export const getWalletDetails = async (userId: mongoose.Types.ObjectId) => {
  const wallet = await Wallet.findOne({ user: userId }).populate({
    path: 'user',
    select: '-password'
  });
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
    Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(query),
  ]);
  return {
    data: transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const initiateFunding = async (userId: mongoose.Types.ObjectId, amount: number) => {
    const wallet:any = await Wallet.findOne({ user: userId }).populate({
      path: 'user',
      select: '-password'
    });
  if (!wallet) throw new Error('Wallet not found');
  const reference = uuidv4();
  const paymentLink = await generatePaymentLink({ amount, reference, email: wallet.user.email });
  await Transaction.create({
    reference: paymentLink.data.reference,
    type: 'fund',
    amount,
    status: 'success',
    receiver: userId,
    wallet: wallet._id
  });
  return { paymentLink };
};

export const transferFunds = async (senderId: mongoose.Types.ObjectId, receiverEmail: string, amount: number) => {
  const senderWallet = await Wallet.findOne({ user: senderId });
  const receiverUser = await User.findOne({ email: receiverEmail });
  const receiverWallet = receiverUser && await Wallet.findOne({ user: receiverUser._id });
  if (!senderWallet || !receiverUser || !receiverWallet) throw new Error('User or wallet not found');
  if (senderWallet.balance < amount) throw new Error('Insufficient balance');

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  await senderWallet.save();
  await receiverWallet.save();

  const reference = uuidv4();
  await Transaction.create({
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
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error('Wallet not found');
  const totalAmount = amount + WITHDRAW_FEE;
  if (wallet.balance < totalAmount) throw new Error('Insufficient balance');
  wallet.balance -= totalAmount;
  await wallet.save();
  const reference = uuidv4();
  await Transaction.create({
    reference,
    type: 'WITHDRAW',
    amount,
    status: 'SUCCESS',
    sender: userId,
  });
  return { message: 'Withdrawal successful', reference };
};
