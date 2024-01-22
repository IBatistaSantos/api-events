export interface EncryptProvider {
  encrypt(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
