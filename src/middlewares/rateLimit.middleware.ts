import rateLimit from 'express-rate-limit';

export const walletFundingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit to 3 funding attempts per windowMs
  message: {
    success: false,
    message: 'Too many funding attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
