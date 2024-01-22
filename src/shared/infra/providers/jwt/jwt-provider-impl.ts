import { Injectable } from '@nestjs/common';
import { JWTProvider } from './jwt.provider';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JWTProviderImpl implements JWTProvider {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken<T>(token: string): T {
    return this.jwtService.verify(token) as T;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
