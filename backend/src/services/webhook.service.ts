import { Transaction } from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';

export const processSuccessfulFunding = async (eventData: any) => {
  const reference = eventData.reference;
  const amountInKobo = eventData.amount;
  const email = eventData.customer.email;
  

  const transaction = await Transaction.findOne({ reference });

  if (!transaction || transaction.status !== 'success') return;

  const userWallet = await Wallet.findOne({ user: transaction.receiver });
  console.log("wallet", userWallet);
  if (!userWallet) return;

  // Convert kobo to naira
  const amount = amountInKobo / 100;

  // Update wallet balance
  userWallet.balance += amount;
  let msg = await userWallet.save();
  console.log(msg, amount);
  

  // Mark transaction as successful
  transaction.status = 'success';
  await transaction.save();

  // Optionally send email to user
};
