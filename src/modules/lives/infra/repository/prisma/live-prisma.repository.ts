import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { TranslationLive } from '@/modules/lives/domain/value-object/translation';
import { Session } from '@/modules/sessions/domain/session';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

@Injectable()
export class LivePrismaRepository implements LiveRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async listBySession(sessionId: string): Promise<Live[]> {
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

  async findSessionByEventId(eventId: string): Promise<Session[]> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });

    return sessions.map((session) => {
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
    });
  }

  async findById(id: string): Promise<Live> {
    const live = await this.prismaService.live.findUnique({
      where: {
        id,
        status: 'ACTIVE',
      },
      include: {
        chat: true,
        LiveTranslation: true,
      },
    });

    if (!live) return null;

    const liveTranslation = live.LiveTranslation?.map((translation) => {
      return new TranslationLive({
        language: translation.language,
        link: translation.link,
        text: translation.text,
      });
    });

    return new Live({
      id: live.id,
      chat: {
        title: live.chat?.title,
        type: live.chat?.type as any,
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
  }

  async findSessionById(sessionId: string): Promise<Session> {
    const session = await this.prismaService.session.findUnique({
      where: {
        id: sessionId,
        status: 'ACTIVE',
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

  async update(live: Live): Promise<void> {
    await this.prismaService.liveChat.deleteMany({
      where: {
        Live: {
          some: {
            id: live.id,
          },
        },
      },
    });

    const chat = await this.prismaService.liveChat.create({
      data: {
        title: live.chat.title,
        type: live.chat.type,
      },
    });

    await this.prismaService.live.update({
      where: {
        id: live.id,
      },
      data: {
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
        typeLink: live.typeLink,
        chatId: chat.id,
        createdAt: live.createdAt,
        updatedAt: live.updatedAt,
        status: live.status.value as UserStatus,
        LiveTranslation: {
          deleteMany: {},
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

  async finishLive(liveIds: string[]): Promise<void> {
    await this.prismaService.live.updateMany({
      where: {
        id: {
          in: liveIds,
        },
        status: 'ACTIVE',
      },
      data: {
        updatedAt: new Date(),
        finished: true,
        finishedAt: new Date(),
      },
    });
  }
}
