import crypto from 'crypto';
import { Request, Response } from 'express';
import { processSuccessfulFunding } from '../services/webhook.service';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export const handlePaystackWebhook = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET)
        .update(req.body)
        .digest('hex');
  
      const signature = req.headers['x-paystack-signature'] as string;
      if (hash !== signature) {
        res.status(401).send('Unauthorized');
        return;
      }
  
      const event = JSON.parse(req.body.toString());
      if (event.event === 'charge.success') {
        await processSuccessfulFunding(event.data);
      }
  
      res.status(200).send('OK');
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(500).send('Webhook failed');
    }
  }
  