import { z } from 'zod';

export const fundWalletSchema = z.object({
  amount: z.number().min(100, 'Minimum fund is ₦100'),
});

export const transferSchema = z.object({
  email: z.string().email(),
  amount: z.number().min(1),
});

export const withdrawSchema = z.object({
  amount: z.number().min(1000, 'Minimum withdrawal is ₦1000'),
});