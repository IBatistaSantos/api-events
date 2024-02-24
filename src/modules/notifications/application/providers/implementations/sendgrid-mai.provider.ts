import { MailService } from '@sendgrid/mail';
import { MailProvider, MailProviderParams } from '../mail.provider';

export class SendGridMailProvider implements MailProvider {
  private readonly client: MailService;

  constructor() {
    this.client = new MailService();
    this.client.setApiKey(process.env.MAIL_SENDGRID_API_KEY);
  }

  async send({ to, subject, body }: MailProviderParams): Promise<string> {
    const message = {
      to: {
        email: to.email,
        name: to.name,
      },
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME,
      },
      subject,
      text: body,
      html: body,
    };

    const response = await this.client.send(message);

    return response[0].headers['x-message-id'];
  }
}
