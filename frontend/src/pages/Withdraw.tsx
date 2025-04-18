
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowDownToLine, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

// Mock bank list for demo purposes
const BANKS = [
  { code: '057', name: 'Zenith Bank' },
  { code: '058', name: 'GTBank' },
  { code: '011', name: 'First Bank' },
  { code: '044', name: 'Access Bank' },
  { code: '050', name: 'Ecobank' },
  { code: '221', name: 'Stanbic IBTC' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '232', name: 'Sterling Bank' },
];

const WITHDRAWAL_FEE = 50;
const MINIMUM_WITHDRAWAL = 1000;

const withdrawSchema = z.object({
  accountNumber: z.string()
    .min(10, 'Account number must be at least 10 digits')
    .max(10, 'Account number must not exceed 10 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  bankCode: z.string().min(1, 'Please select a bank'),
  amount: z.coerce.number()
    .min(MINIMUM_WITHDRAWAL, `Amount must be at least ₦${MINIMUM_WITHDRAWAL.toLocaleString()}`)
    .refine(val => val % 1 === 0, { message: 'Amount must be a whole number' }),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

const Withdraw = () => {
  const { withdrawFunds, wallet, isLoading, error, fetchWalletBalance } = useWallet();
  const [success, setSuccess] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [accountDetails, setAccountDetails] = useState({ accountNumber: '', bankName: '' });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      accountNumber: '',
      bankCode: '',
      amount: MINIMUM_WITHDRAWAL,
    },
  });

  const watchAmount = watch('amount');
  const watchBankCode = watch('bankCode');
  
  const totalWithFee = (watchAmount || 0) + WITHDRAWAL_FEE;
  const hasInsufficientFunds = wallet ? totalWithFee > wallet.balance : false;
  const selectedBank = BANKS.find(bank => bank.code === watchBankCode);

  const onSubmit = async (data: WithdrawFormValues) => {
    if (hasInsufficientFunds) return;
    
    const result = await withdrawFunds(data.amount, data.accountNumber, data.bankCode);
    
    if (result) {
      setSuccess(true);
      setWithdrawalAmount(data.amount);
      setAccountDetails({
        accountNumber: data.accountNumber,
        bankName: selectedBank?.name || '',
      });
      reset();
      // Refresh wallet balance
      fetchWalletBalance();
    }
  };

  const handleNewWithdrawal = () => {
    setSuccess(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Withdraw Funds</h2>
          <p className="text-muted-foreground mt-2">
            Withdraw money from your wallet to your bank account
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {success ? (
            <Card className="border-2 border-success/30 bg-success/5">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  <CardTitle>Withdrawal Initiated!</CardTitle>
                </div>
                <CardDescription>
                  Your withdrawal request has been processed
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-lg font-bold">{formatCurrency(withdrawalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Fee</span>
                      <span className="font-medium">{formatCurrency(WITHDRAWAL_FEE)}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(withdrawalAmount + WITHDRAWAL_FEE)}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Account Number</span>
                      <span className="font-medium">{accountDetails.accountNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <span className="font-medium">{accountDetails.bankName}</span>
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Processing Time</AlertTitle>
                    <AlertDescription>
                      Your withdrawal should be processed within 24 hours.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full" onClick={handleNewWithdrawal}>
                  Make Another Withdrawal
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Withdraw Money</CardTitle>
                <CardDescription>
                  Withdraw funds from your wallet to your bank account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {hasInsufficientFunds && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Funds</AlertTitle>
                    <AlertDescription>
                      Your wallet balance ({formatCurrency(wallet?.balance || 0)}) is less than the total amount needed for this withdrawal (including a ₦{WITHDRAWAL_FEE} fee).
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    A fee of ₦{WITHDRAWAL_FEE} will be charged for this withdrawal.
                    Minimum withdrawal amount is ₦{MINIMUM_WITHDRAWAL.toLocaleString()}.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit(onSubmit)} id="withdraw-form">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (₦)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="amount"
                          type="number"
                          className={`pl-10 text-lg ${errors.amount || hasInsufficientFunds ? 'border-destructive' : ''}`}
                          {...register('amount')}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">₦</span>
                        </div>
                      </div>
                      {errors.amount && (
                        <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bankCode">Select Bank</Label>
                      <Select
                        onValueChange={(value) => setValue('bankCode', value)}
                        defaultValue={watchBankCode}
                      >
                        <SelectTrigger className={errors.bankCode ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bankCode && (
                        <p className="text-sm text-destructive mt-1">{errors.bankCode.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="10-digit account number"
                        className={errors.accountNumber ? 'border-destructive' : ''}
                        {...register('accountNumber')}
                      />
                      {errors.accountNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.accountNumber.message}</p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="bg-primary/5 border-t border-primary/10 flex-col space-y-4">
                <div className="flex flex-col w-full space-y-2">
                  <div className="flex justify-between items-center w-full py-1">
                    <span className="text-sm text-muted-foreground">Withdrawal Amount</span>
                    <span className="font-medium">
                      {formatCurrency(watchAmount || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center w-full py-1">
                    <span className="text-sm text-muted-foreground">Fee</span>
                    <span className="font-medium">
                      {formatCurrency(WITHDRAWAL_FEE)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center w-full py-1">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(totalWithFee)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center w-full py-1">
                    <span className="text-sm text-muted-foreground">Available Balance</span>
                    <span className="font-medium">
                      {formatCurrency(wallet?.balance || 0)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  form="withdraw-form"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || hasInsufficientFunds}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Withdraw Funds
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
