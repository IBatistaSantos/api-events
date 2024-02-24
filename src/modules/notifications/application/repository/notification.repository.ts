import { Template, TemplateContext } from '../../domain/template';

export interface SaveSenderEmailParams {
  messageId: string;
  context: TemplateContext;
  to: string;
  templateId: string;
}

export interface NotificationRepository {
  findByContext(context: TemplateContext): Promise<Template>;
  save(params: SaveSenderEmailParams): Promise<void>;
}
