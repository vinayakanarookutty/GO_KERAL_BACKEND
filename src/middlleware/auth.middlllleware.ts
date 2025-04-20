/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('x-auth-token');
      if (!token) {
        throw new HttpException('Please Login', HttpStatus.UNAUTHORIZED);
      }

      const verified = jwt.verify(token, 'passwordKey'); // Use an environment variable for security
      if (!verified) {
        throw new HttpException(
          'Token verification failed, authorization denied',
          HttpStatus.UNAUTHORIZED,
        );
      }

      req['user'] = verified; // Store user details in request
      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpExceptions with their original status
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
