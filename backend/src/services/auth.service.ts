import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { generateUUID } from '../utils/generateUUID';
import { PasswordReset } from '../models/passwordReset.model';
import { sendEmail } from '../utils/email';

const JWT_Secret = process.env.JWT_SECRET as string || "vyufvdsdvVSRDRDJVUFTYDOIUIHb9U89Y7FYAFddse";

if (!JWT_Secret) throw new Error('JWT_SECRET is not set');

export const register = async (data: { name: string; email: string; password: string }) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });

  // ✅ Send welcome email
  await sendEmail(
    user.email,
    'Welcome to Fintech Wallet',
    `<h2>Hello ${user.name},</h2><p>Thanks for registering! Your wallet is now ready to use.</p>`
  );

  return {
    success: true,
    data: {
      message: 'Registration successful',
    }
  };
};

export const login = async (data: { email: string; password: string }) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, JWT_Secret, { expiresIn: '1d' });

  return {
    success: true,
    data: {
      token,
      message: 'Login successful',
    }
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const token = generateUUID();
  await PasswordReset.create({ userId: user._id, token });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail(email, 'Password Reset', `Click here to reset: ${resetUrl}`);

  return { 
    success: true,
    data: {
      message: 'Password reset link sent to your mail'
    }
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const record = await PasswordReset.findOne({ token });
  if (!record) throw new Error('Invalid or expired token');

  const user = await User.findById(record.userId);
  if (!user) throw new Error('User not found');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await PasswordReset.deleteOne({ token });

  return { 
    success: true,
    data: {
      message: 'Password reset successful'
    }
  };
};
