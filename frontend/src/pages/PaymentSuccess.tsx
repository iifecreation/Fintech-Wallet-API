
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../components/ui/use-toast';
// import walletService from '../services/walletService';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchWalletBalance } = useWallet();
  const { toast } = useToast();
  const reference = searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid payment reference",
        });
        navigate('/fund-wallet');
        return;
      }

      try {
        // await walletService.verifyTransaction(reference);
        await fetchWalletBalance();
        toast({
          title: "Payment Successful",
          description: "Your wallet has been funded successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error instanceof Error ? error.message : "Failed to verify payment",
        });
        navigate('/fund-wallet');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your wallet has been funded successfully. The amount will be reflected in your balance shortly.
          </p>
          
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;