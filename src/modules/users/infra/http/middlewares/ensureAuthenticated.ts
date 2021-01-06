import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError('JWT Token is missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const secret = authConfig.jwt.secret;

    if(secret) {
      const decoded = verify(token, secret);
      const { sub } = decoded as TokenPayload;
      req.user = { id: sub };
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }
}
