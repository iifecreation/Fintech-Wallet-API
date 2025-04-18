
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
    id: string;
    balance: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Transaction Types
  export enum TransactionType {
    FUNDING = 'FUNDING',
    TRANSFER = 'TRANSFER',
    WITHDRAWAL = 'WITHDRAWAL'
  }
  
  export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESSFUL = 'SUCCESSFUL',
    FAILED = 'FAILED'
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    reference: string;
    senderWalletId?: string;
    recipientWalletId?: string;
    recipientEmail?: string;
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