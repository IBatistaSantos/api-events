export interface MailProviderParams {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
}

export interface MailProvider {
  send(params: MailProviderParams): Promise<string>;
}
