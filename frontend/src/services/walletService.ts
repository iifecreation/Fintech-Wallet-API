import { 
  FundWalletData, 
  Transaction, 
  TransactionResponse, 
  TransferFundsData, 
  Wallet, 
  WithdrawFundsData 
} from '../types/index';
import { request } from './api';

const walletService = {
  getWalletBalance: async () => {
    return request<Wallet>({
      method: 'GET',
      url: '/wallet/balance',
    });
  },
  
  fundWallet: async (data: FundWalletData) => {
    return request<{ transaction: Transaction; paymentUrl: string }>({
      method: 'POST',
      url: '/wallet/fund',
      data,
    });
  },
  
  transferFunds: async (data: TransferFundsData) => {
    return request<{ transaction: Transaction }>({
      method: 'POST',
      url: '/wallet/transfer',
      data,
    });
  },
  
  withdrawFunds: async (data: WithdrawFundsData) => {
    return request<{ transaction: Transaction }>({
      method: 'POST',
      url: '/wallet/withdraw',
      data,
    });
  },
  
  getTransactions: async () => {
    return request<TransactionResponse>({
      method: 'GET',
      url: '/wallet/transactions',
    });
  },
  
  verifyTransaction: async (reference: string) => {
    return request<{ transaction: Transaction }>({
      method: 'GET',
      url: `/wallet/verify-transaction/${reference}`,
    });
  }
};

export default walletService;
