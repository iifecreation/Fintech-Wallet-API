import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL!;
const BASE_URL = 'https://api.paystack.co';

interface PaymentParams {
  amount: number;
  reference: string;
  email: string;
  callback_url?: string;
}

export const generatePaymentLink = async ({
  amount,
  reference,
  email,
  callback_url = `${FRONTEND_URL}/success`,
}: PaymentParams) => {
  
  const response = await axios.post(
    `${BASE_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      callback_url,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
