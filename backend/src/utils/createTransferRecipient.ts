import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export const createTransferRecipient = async ({
  account_number,
  bank_code,
  name
}: {
  name: string;
  account_number: string;
  bank_code: string;
}) => {
  const response = await axios.post(
    'https://api.paystack.co/transferrecipient',
    {
      type: 'nuban',
      name,
      account_number,
      bank_code,
      currency: 'NGN',
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data.data; // includes recipient_code
};
