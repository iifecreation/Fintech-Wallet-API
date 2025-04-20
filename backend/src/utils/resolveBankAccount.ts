import axios from "axios"
import dotenv from 'dotenv';

dotenv.config();

export const resolveBankAccount = async (accountNumber: string, bankCode: string) => {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data.data;
    
  };
  