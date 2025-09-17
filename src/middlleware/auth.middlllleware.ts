/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('x-auth-token');
      const extractedToken = this.authService.extractTokenFromHeader(token);
      const verified = this.authService.verifyToken(extractedToken);
      
      req['user'] = verified;
      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
