export interface SendEmailParams {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
  variables?: Record<string, unknown>;
}

export interface EmailService {
  send(params: SendEmailParams): Promise<void>;
}
