
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Plus,
  SendHorizontal,
  ArrowDownToLine
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Transaction, TransactionStatus, TransactionType } from '../types/index';
import { useAuth } from '../contexts/AuthContext';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

const Dashboard = () => {
  const { wallet, transactions, isLoading, fetchWalletBalance, fetchTransactions } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authState } = useAuth();
  const user: any = authState.user;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchWalletBalance(),
      fetchTransactions(),
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate quick stats
  const recentTransactions = transactions?.slice(0, 5);
  
  const totalIncoming = transactions
    ?.filter(t => t.type === TransactionType.FUNDING && t.status === TransactionStatus.SUCCESSFUL || (t.type === TransactionType.TRANSFER && t.senderName == user?.name ))
    ?.reduce((sum, t) => sum + t.amount, 0);
    
    
  const totalOutgoing = transactions
    ?.filter(t => ((t.type === TransactionType.TRANSFER && t.senderName == user?.name ) || t.type === TransactionType.WITHDRAWAL) && t.status === TransactionStatus.SUCCESSFUL)
    ?.reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.FUNDING:
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <Plus className="h-3 w-3 mr-1" />Funding
        </Badge>;
      case TransactionType.TRANSFER:
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
          <SendHorizontal className="h-3 w-3 mr-1" />Transfer
        </Badge>;
      case TransactionType.WITHDRAWAL:
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
          <ArrowDownToLine className="h-3 w-3 mr-1" />Withdrawal
        </Badge>;
      default:
        return null;
    }
  };

  const getAmountLabel = (transaction: Transaction) => {
    if (transaction.type === TransactionType.FUNDING) {
      return <span className="text-success">+{formatCurrency(transaction.amount)}</span>;
    } else {
      return <span className="text-danger">-{formatCurrency(transaction.amount)}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 sm:mt-0"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Wallet Balance</CardTitle>
                <CardDescription>Available balance in your wallet</CardDescription>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {isLoading ? (
                  <Skeleton className="h-10 w-48" />
                ) : (
                  <div className="flex items-center">
                    <h1 className="text-4xl font-bold mr-2">
                      {showBalance ? formatCurrency(wallet?.balance || 0) : '•••••••••'}
                    </h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    >
                      {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2 bg-primary/5 border-t border-primary/10">
              <Link to="/fund-wallet">
                <Button>Fund Wallet</Button>
              </Link>
              <Link to="/transfer">
                <Button variant="outline">Transfer</Button>
              </Link>
              <Link to="/withdraw">
                <Button variant="outline">Withdraw</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Money In</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(totalIncoming || 0)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Money Out</CardTitle>
                <TrendingDown className="h-4 w-4 text-danger" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-danger">
                    {formatCurrency(totalOutgoing || 0)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </div>
              <Link to="/transactions">
                <Button variant="ghost" className="flex items-center text-sm">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : recentTransactions?.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions?.map((transaction : any) => (
                    <div key={transaction.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {transaction.type === TransactionType.FUNDING ? (
                              <TrendingUp className="h-5 w-5 text-success" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-danger" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium line-clamp-1">
                                {transaction.type === TransactionType.TRANSFER ? (
                                  transaction?.sender === user?.balance?.user?._id
                                    ? `Transfer to ${transaction?.recipientName}`
                                    : `Transfer from ${transaction?.senderName}`
                                ) : transaction.type === TransactionType.WITHDRAWAL ? (
                                  'Withdrawal'
                                ) : (
                                  'Wallet Funding'
                                )}
                              </p>
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {getAmountLabel(transaction)}
                          </div>
                          <p className="text-xs">
                            <Badge 
                              variant={
                                transaction.status === TransactionStatus.SUCCESSFUL ? "default" : 
                                transaction.status === TransactionStatus.FAILED ? "destructive" : 
                                "outline"
                              }
                              className={`text-[10px] px-1 ${
                                transaction.status === TransactionStatus.SUCCESSFUL ? "bg-success text-success-foreground" : ""
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;