import {
  NotificationRepository,
  SaveSenderEmailParams,
} from '@/modules/notifications/application/repository/notification.repository';
import {
  Template,
  TemplateContextValue,
} from '@/modules/notifications/domain/template';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationPrismaRepository implements NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findByContext(context: TemplateContextValue): Promise<Template> {
    const template = await this.prismaService.template.findFirst({
      where: {
        content: context,
        status: 'ACTIVE',
      },
    });

    if (!template) {
      return null;
    }

    return new Template({
      body: template.body,
      context: template.content as TemplateContextValue,
      subject: template.subject,
      createdAt: template.createdAt,
      id: template.id,
      status: template.status,
      updatedAt: template.updatedAt,
    });
  }

  async save(params: SaveSenderEmailParams): Promise<void> {
    await this.prismaService.sendMail.create({
      data: {
        messageId: params.messageId,
        content: params.context,
        to: params.to,
        templateId: params.templateId,
      },
    });
  }
}
