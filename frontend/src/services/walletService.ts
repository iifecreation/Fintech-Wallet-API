import { 
  FundWalletData, 
  Transaction, 
  TransactionResponse, 
  TransferFundsData, 
  Wallet, 
  WithdrawFundsData 
} from '@/types';
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
  
  getTransactions: async (page = 1, limit = 10) => {
    return request<TransactionResponse>({
      method: 'GET',
      url: '/wallet/transactions',
      params: {
        page,
        limit,
      },
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
