
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import walletService from '../services/walletService';
import { Transaction, TransactionResponse, Wallet } from '../types/index';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/use-toast';

interface WalletContextProps {
  wallet: Wallet | null;
  transactions: Transaction[];
  transactionMeta: TransactionResponse['meta'] | null;
  isLoading: boolean;
  error: string | null;
  fetchWalletBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fundWallet: (amount: number) => Promise<any | undefined>;
  transferFunds: (amount: number, recipientEmail: string) => Promise<boolean>;
  withdrawFunds: (amount: number, accountNumber: string, bankCode: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionMeta, setTransactionMeta] = useState<TransactionResponse['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { authState } = useAuth();
  const { toast } = useToast();

  // Fetch wallet balance when authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchWalletBalance();
      fetchTransactions();
    }
  }, [authState.isAuthenticated]);

  const fetchWalletBalance = async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const walletData:any = await walletService.getWalletBalance();
      console.log(walletData);
      setWallet(walletData?.balance);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet balance';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!authState.isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response: any = await walletService.getTransactions();
     console.log(response);
     
      setTransactions(response);
      setTransactionMeta(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fundWallet = async (amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await walletService.fundWallet({ amount });
      
      toast({
        title: "Processing Payment",
        description: `Redirecting you to complete your payment of ₦${amount.toLocaleString()}.`,
      });
      
      // Return payment URL for redirect
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate funding';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Funding Failed",
        description: errorMessage,
      });
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const transferFunds = async (amount: number, recipientEmail: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate balance is sufficient
      if (wallet && wallet.balance < amount) {
        throw new Error('Insufficient balance for this transfer');
      }
      
      await walletService.transferFunds({ amount, recipientEmail });
      
      // Refresh wallet balance after successful transfer
      await fetchWalletBalance();
      await fetchTransactions();
      
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ₦${amount.toLocaleString()} to ${recipientEmail}.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to transfer funds';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number, accountNumber: string, bankCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate minimum withdrawal amount
      if (amount < 1000) {
        throw new Error('Minimum withdrawal amount is ₦1,000');
      }
      
      // Validate balance is sufficient (including fee)
      if (wallet && wallet.balance < (amount + 50)) {
        throw new Error('Insufficient balance for this withdrawal (including ₦50 fee)');
      }
      
      await walletService.withdrawFunds({ amount, accountNumber, bankCode });
      
      // Refresh wallet balance after successful withdrawal
      await fetchWalletBalance();
      await fetchTransactions();
      
      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ₦${amount.toLocaleString()} has been initiated. A fee of ₦50 was applied.`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw funds';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        transactionMeta,
        isLoading,
        error,
        fetchWalletBalance,
        fetchTransactions,
        fundWallet,
        transferFunds,
        withdrawFunds,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
