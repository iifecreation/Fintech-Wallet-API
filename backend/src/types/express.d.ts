import { User } from '../models/user.model'; 

declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      password: string;
      name: string
    }

    interface Request {
      user: User;
    }
  }
}
