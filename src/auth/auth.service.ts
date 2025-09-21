/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  id: string;
  type: 'user' | 'driver';
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'passwordKey';
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      throw new HttpException('Please Login', HttpStatus.UNAUTHORIZED);
    }
    return authHeader;
  }
}