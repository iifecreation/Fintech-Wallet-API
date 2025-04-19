import { UserDocument } from '../../models/user.model';

declare global {
  namespace Express {
    interface User extends Document {
      _id: string;
      email?: string;
      name?: string;
      password?:string
    }

    interface Request {
      user?: UserDocument;
    }
  }
}
