import { EmailService, SendEmailParams } from '../email.provider';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

export class MailerSenderProvider implements EmailService {
  async send(params: SendEmailParams): Promise<void> {
    const { to, subject, body } = params;
    const mailerSend = new MailerSend({
      apiKey: process.env.MAIL_SENDER_API_KEY,
    });

    const sentFrom = new Sender('you@candyapp.online', 'Evnts Corp');

    const recipients = [new Recipient(to.email, to.name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(body)
      .setText(body);

    await mailerSend.email.send(emailParams);
  }
}
