import { Request } from 'express';
import User from '../models/userModel';

export interface ExtendedRequest extends Request {
  user?: User;
}
