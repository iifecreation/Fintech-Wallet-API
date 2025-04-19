
// User Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // Wallet Types
  export interface Wallet {
    _id: string;
    walletId: string;
    balance: number;
    createdAt?: string;
    updatedAt: string;
    user: {
      createdAt?: string;
      updatedAt: string;
      email: string,
      name: string,
      _id: string;
    }
  }
  
  // Transaction Types
  export enum TransactionType {
    FUNDING = 'fund',
    TRANSFER = 'transfer',
    WITHDRAWAL = 'withdraw'
  }
  
  export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESSFUL = 'success',
    FAILED = 'failed'
  }
  
  export interface Transaction {
    _id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    reference: string;
    sender?: string;
    receiver?: string;
    description: string
    wallet?: any;
    createdAt: string;
    metadata?: Record<string, any>;
  }
  
  export interface TransactionResponse {
    data: Transaction[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }
  
  // Form Types
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
  }
  
  export interface FundWalletData {
    amount: number;
  }
  
  export interface TransferFundsData {
    amount: number;
    recipientEmail: string;
    description?: string;
  }
  
  export interface WithdrawFundsData {
    amount: number;
    accountNumber: string;
    bankCode: string;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
  }