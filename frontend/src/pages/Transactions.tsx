
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  FileText,
  // Plus,
  // SendHorizontal,
  // ArrowDownToLine,
  SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

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

const Transactions = () => {
  const { transactions, transactionMeta, isLoading, fetchTransactions } = useWallet();
  const { authState } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  // Apply filters to transactions
  const filteredTransactions = transactions?.filter((transaction: any) => {
    // Search filter
    const searchFields = [
      transaction.reference,
      transaction.recipientEmail || '',
      transaction.id,
    ].map(field => field);
    
    const matchesSearch = searchTerm === '' || 
      searchFields.some(field => field.includes(searchTerm.toLowerCase()));

    // Type filter
    const matchesType = typeFilter === 'all' || 
      transaction.type === typeFilter;

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      transaction.status === statusFilter;

    // Date filter
    const matchesDate = !date || 
      new Date(transaction.createdAt).toDateString() === date.toDateString();

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDate(undefined);
  };
  const user: any = authState.user;

  // const getTransactionIcon = (type: TransactionType) => {
  //   switch (type) {
  //     case TransactionType.FUNDING:
  //       return <Badge variant="outline" className="bg-success/10 text-success border-success/20">
  //         <Plus className="h-3 w-3 mr-1" />Funding
  //       </Badge>;
  //     case TransactionType.TRANSFER:
  //       return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
  //         <SendHorizontal className="h-3 w-3 mr-1" />Transfer
  //       </Badge>;
  //     case TransactionType.WITHDRAWAL:
  //       return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
  //         <ArrowDownToLine className="h-3 w-3 mr-1" />Withdrawal
  //       </Badge>;
  //     default:
  //       return null;
  //   }
  // };

  const getAmountLabel = (transaction: Transaction) => {
    if (transaction.type === TransactionType.FUNDING) {
      return <span className="text-success">+{formatCurrency(transaction.amount)}</span>;
    } else {
      return <span className="text-danger">-{formatCurrency(transaction.amount)}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Transactions</h2>
            <p className="text-muted-foreground mt-1">
              View all your transaction history
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  {filteredTransactions?.length} transactions found
                </CardDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Latest First
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Highest Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Lowest Amount
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
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
              ) : filteredTransactions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Type</th>
                        <th className="text-left py-3 px-2">Details</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-right py-3 px-2">Amount</th>
                        <th className="text-right py-3 px-2">Status</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction: any) => (
                        <tr key={transaction?.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-2">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {transaction.type === TransactionType.FUNDING ? (
                                <TrendingUp className="h-5 w-5 text-success" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-danger" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium truncate max-w-[180px]">
                                {transaction.type === TransactionType.TRANSFER 
                                  ? `Transfer ${transaction?.sender == user?.name ? "to " + transaction?.recipientName : "from " + transaction?.senderName}`
                                  : transaction.type === TransactionType.WITHDRAWAL
                                    ? 'Withdrawal'
                                    : 'Wallet Funding'
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Ref: {transaction.reference.slice(-8)}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="text-sm">
                                {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(transaction.createdAt), 'h:mm a')}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right font-medium">
                            {getAmountLabel(transaction)}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <Badge 
                              variant={
                                transaction.status === TransactionStatus.SUCCESSFUL ? "default" : 
                                transaction.status === TransactionStatus.FAILED ? "destructive" : 
                                "outline"
                              }
                              className={`${
                                transaction.status === TransactionStatus.SUCCESSFUL ? "bg-success text-success-foreground" : ""
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-32 text-center">
                  <p className="text-muted-foreground">No transactions found</p>
                  {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || date) && (
                    <Button variant="link" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
              
              {transactionMeta && transactionMeta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * transactionMeta.itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * transactionMeta.itemsPerPage, transactionMeta.totalItems)} of{' '}
                    {transactionMeta.totalItems} transactions
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-sm font-medium">
                      Page {currentPage} of {transactionMeta.totalPages}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === transactionMeta.totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;