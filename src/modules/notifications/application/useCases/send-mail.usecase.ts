import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { TemplateContextValue } from '../../domain/template';
import { MailProvider } from '../providers/mail.provider';

interface SendEmailParams {
  context: TemplateContextValue;
  to: {
    name: string;
    email: string;
  };
  organizationId?: string;
  eventId?: string;
  variables?: Record<string, unknown>;
}

@Injectable()
export class SendMailUseCase {
  constructor(
    @Inject('MailProvider')
    private readonly provider: MailProvider,

    @Inject('NotificationRepository')
    private readonly repository: NotificationRepository,
  ) {}

  async execute(params: SendEmailParams): Promise<void> {
    const { context, to, variables } = params;

    const template = await this.repository.findByContext(context);
    if (!template) {
      throw new NotFoundException('Template nao encontrado');
    }

    const { body, subject } = template.parse(variables);

    const messageId = await this.provider.send({
      to,
      subject,
      body,
    });

    console.log(`Email sent with messageId: ${messageId}`);

    await this.repository.save({
      messageId,
      templateId: template.id,
      to: to.email,
      context,
    });
  }
}
