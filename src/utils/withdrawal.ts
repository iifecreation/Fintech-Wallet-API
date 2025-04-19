import axios from "axios"
import dotenv from 'dotenv';

dotenv.config();

export const initiateTransfer = async ({
    amount,
    recipient_code,
    reason
  }: {
    amount: number;
    recipient_code: string;
    reason: string;
  }) => {
    const response = await axios.post(
      `https://api.paystack.co/transfer`,
      {
        source: "balance",
        amount: amount * 100, // Paystack uses kobo
        recipient: recipient_code,
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data.data;
  };
  