import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { TranslationLive } from '@/modules/lives/domain/value-object/translation';
import { Session } from '@/modules/sessions/domain/session';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LivePrismaRepository implements LiveRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findSessionById(sessionId: string): Promise<Session> {
    const session = await this.prismaService.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    return new Session({
      date: session.date,
      eventId: session.eventId,
      hourStart: session.hourStart,
      id: session.id,
      finished: session.finished,
      hourEnd: session.hourEnd,
      isCurrent: session.isCurrent,
      status: session.status,
    });
  }

  async listBySessionId(sessionId: string): Promise<Live[]> {
    const lives = await this.prismaService.live.findMany({
      where: {
        sessionId,
        status: 'ACTIVE',
      },
      include: {
        chat: true,
        LiveTranslation: true,
      },
    });

    if (!lives || !lives.length) return [];

    return lives.map((live) => {
      const liveTranslation = live.LiveTranslation.map((translation) => {
        return new TranslationLive({
          language: translation.language,
          link: translation.link,
          text: translation.text,
        });
      });

      return new Live({
        id: live.id,
        chat: {
          title: live.chat.title,
          type: live.chat.type as any,
        },
        createdAt: live.createdAt,
        disableChat: live.disableChat,
        disableReactions: live.disableReactions,
        enableTranslate: live.enableTranslate,
        eventId: live.eventId,
        finished: live.finished,
        finishedAt: live.finishedAt,
        isMain: live.isMain,
        link: live.link,
        sessionId: live.sessionId,
        title: live.title,
        translation: liveTranslation,
        typeLink: live.typeLink,
        updatedAt: live.updatedAt,
      });
    });
  }

  async removeMainLive(liveIds: string[]): Promise<void> {
    await this.prismaService.live.updateMany({
      where: {
        id: {
          in: liveIds,
        },
      },
      data: {
        isMain: false,
      },
    });
  }
  async save(live: Live): Promise<void> {
    const chat = await this.prismaService.liveChat.create({
      data: {
        title: live.chat.title,
        type: live.chat.type,
      },
    });

    await this.prismaService.live.create({
      data: {
        disableChat: live.disableChat,
        disableReactions: live.disableReactions,
        enableTranslate: live.enableTranslate,
        eventId: live.eventId,
        id: live.id,
        finished: live.finished,
        finishedAt: live.finishedAt,
        isMain: live.isMain,
        link: live.link,
        sessionId: live.sessionId,
        title: live.title,
        typeLink: live.typeLink,
        chatId: chat.id,
        LiveTranslation: {
          create: live.translation.map((translation) => {
            return {
              language: translation.language,
              link: translation.link,
              text: translation.text,
            };
          }),
        },
      },
    });
  }
}
