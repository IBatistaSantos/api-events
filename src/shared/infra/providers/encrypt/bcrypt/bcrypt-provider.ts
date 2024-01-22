import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { EncryptProvider } from '../encrypt-provider';
@Injectable()
export class BcryptProvider implements EncryptProvider {
  async compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
  async encrypt(value: string): Promise<string> {
    return hash(value, 8);
  }
}
