
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SendHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';

const transferSchema = z.object({
  recipientEmail: z.string().email('Please enter a valid email'),
  amount: z.coerce.number()
    .min(100, 'Amount must be at least ₦100')
    .refine(val => val % 1 === 0, { message: 'Amount must be a whole number' }),
  description: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

const Transfer = () => {
  const { transferFunds, wallet, isLoading, error, fetchWalletBalance } = useWallet();
  const [success, setSuccess] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientEmail: '',
      amount: undefined,
      description: '',
    },
  });

  const watchAmount = watch('amount');
  const hasInsufficientFunds = wallet ? watchAmount > wallet.balance : false;

  const onSubmit = async (data: TransferFormValues) => {
    if (hasInsufficientFunds) return;
    
    const result = await transferFunds(data.amount, data.recipientEmail);
    
    if (result) {
      setSuccess(true);
      setTransferAmount(data.amount);
      setRecipientEmail(data.recipientEmail);
      reset();
      // Refresh wallet balance
      fetchWalletBalance();
    }
  };

  const handleNewTransfer = () => {
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
          <h2 className="text-3xl font-bold">Transfer Funds</h2>
          <p className="text-muted-foreground mt-2">
            Send money to another FinWave user using their email address
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
                  <CardTitle>Transfer Successful!</CardTitle>
                </div>
                <CardDescription>
                  Your transfer has been completed successfully
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-lg font-bold">{formatCurrency(transferAmount)}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Recipient</span>
                      <span className="font-medium">{recipientEmail}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full" onClick={handleNewTransfer}>
                  Make Another Transfer
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>
                  Transfer funds to another FinWave user
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
                      Your wallet balance ({formatCurrency(wallet?.balance || 0)}) is less than the amount you want to transfer.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} id="transfer-form">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipientEmail">Recipient Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="name@example.com"
                        className={errors.recipientEmail ? 'border-destructive' : ''}
                        {...register('recipientEmail')}
                      />
                      {errors.recipientEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.recipientEmail.message}</p>
                      )}
                    </div>

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
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="What's this transfer for?"
                        {...register('description')}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="bg-primary/5 border-t border-primary/10 flex-col space-y-4">
                <div className="flex justify-between items-center w-full py-2">
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(wallet?.balance || 0)}
                  </span>
                </div>
                
                <Button 
                  type="submit"
                  form="transfer-form"
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
                      <SendHorizontal className="mr-2 h-4 w-4" />
                      Send Money
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

export default Transfer;
