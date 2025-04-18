import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'fund' | 'transfer' | 'withdraw';

export interface ITransaction extends Document {
  type: TransactionType;
  amount: number;
  status: 'success' | 'failed';
  reference: string;
  sender?: mongoose.Types.ObjectId;
  receiver?: mongoose.Types.ObjectId;
  wallet: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ['fund', 'transfer', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    reference: { type: String, unique: true, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
