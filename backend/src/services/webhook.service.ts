import { Transaction } from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';

export const processSuccessfulFunding = async (eventData: any) => {
  const reference = eventData.reference;
  const amountInKobo = eventData.amount;
  const email = eventData.customer.email;

  console.log(eventData);
  

  const transaction = await Transaction.findOne({ reference });
  if (!transaction || transaction.status === 'success') return;

  const userWallet = await Wallet.findOne({ user: transaction.receiver });
  if (!userWallet) return;

  // Convert kobo to naira
  const amount = amountInKobo / 100;

  // Update wallet balance
  userWallet.balance += amount;
  await userWallet.save();

  // Mark transaction as successful
  transaction.status = 'success';
  await transaction.save();

  // Optionally send email to user
};
