export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  constructor(message: string, statusCode?: number, error?: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
