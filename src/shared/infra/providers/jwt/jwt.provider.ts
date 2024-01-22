export interface JWTProvider {
  generateToken(payload: any): string;
  verifyToken<T>(token: string): T;
}
