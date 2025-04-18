
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Search,
  FileText,
  Plus,
  SendHorizontal,
  ArrowDownToLine,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Transaction, TransactionStatus, TransactionType } from '@/types';
import { Calendar } from '@/components/ui/calendar';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(currentPage);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchTransactions(page);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const searchFields = [
      transaction.reference,
      transaction.recipientEmail || '',
      transaction.id,
    ].map(field => field.toLowerCase());
    
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Transactions</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transaction Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value={TransactionType.FUNDING}>Funding</SelectItem>
                        <SelectItem value={TransactionType.TRANSFER}>Transfer</SelectItem>
                        <SelectItem value={TransactionType.WITHDRAWAL}>Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value={TransactionStatus.SUCCESSFUL}>Successful</SelectItem>
                        <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 w-[200px] md:w-[300px]"
              />
            </div>
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
                  {filteredTransactions.length} transactions found
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
              ) : filteredTransactions.length > 0 ? (
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
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
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
                                  ? `Transfer to ${transaction.recipientEmail}`
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