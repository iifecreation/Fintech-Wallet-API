
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define quick amounts
const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000];

const fundWalletSchema = z.object({
  amount: z.coerce.number().min(100, 'Amount must be at least ₦100'),
});

type FundWalletFormValues = z.infer<typeof fundWalletSchema>;

const FundWallet = () => {
  const { fundWallet, isLoading, error } = useWallet();
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FundWalletFormValues>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: {
      amount: 1000,
    },
  });

  const watchAmount = watch('amount');

  const handleQuickAmountClick = (amount: number) => {
    setValue('amount', amount, { shouldValidate: true });
  };

  const onSubmit = async (data: FundWalletFormValues) => {
    setRedirecting(true);
    const paymentUrl = await fundWallet(data.amount);
    
    if (paymentUrl) {
      // Redirect to payment gateway
      window.location.href = paymentUrl;
    } else {
      setRedirecting(false);
    }
  };

  // Format currency as user types
  const formatAmountDisplay = (amount: number) => {
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
          <h2 className="text-3xl font-bold">Fund Your Wallet</h2>
          <p className="text-muted-foreground mt-2">
            Add money to your wallet using your debit card or bank transfer
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <CardTitle>Add Money</CardTitle>
              <CardDescription>
                Select an amount or enter a custom amount to fund your wallet
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} id="fund-wallet-form">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="amount"
                        type="number"
                        {...register('amount')}
                        className={`pl-10 text-lg ${errors.amount ? 'border-destructive' : ''}`}
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
                    <Label>Quick Amounts</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                      {QUICK_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={watchAmount === amount ? "default" : "outline"}
                          className="h-auto py-2"
                          onClick={() => handleQuickAmountClick(amount)}
                        >
                          ₦{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="bg-primary/5 border-t border-primary/10 flex-col space-y-2">
              <div className="flex justify-between items-center w-full py-2">
                <span className="text-sm text-muted-foreground">You will pay</span>
                <span className="text-lg font-semibold">
                  {formatAmountDisplay(watchAmount || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center w-full py-2 border-t border-primary/10">
                <span className="text-sm text-muted-foreground">You will receive</span>
                <span className="text-lg font-semibold text-success">
                  {formatAmountDisplay(watchAmount || 0)}
                </span>
              </div>
              
              <Button 
                type="submit"
                form="fund-wallet-form"
                className="w-full mt-4"
                size="lg"
                disabled={isLoading || redirecting}
              >
                {isLoading || redirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {redirecting ? 'Redirecting to payment gateway...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Payments are securely processed</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FundWallet;
