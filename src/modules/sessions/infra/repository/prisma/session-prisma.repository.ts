import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { Session } from '@/modules/sessions/domain/session';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepositoryPrisma implements SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async listByEventId(eventId: string): Promise<Session[]> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        eventId,
      },
    });

    if (!sessions) return [];

    return sessions.map(
      (session) =>
        new Session({
          id: session.id,
          eventId: session.eventId,
          date: session.date,
          hourStart: session.hourStart,
          hourEnd: session.hourEnd,
          isCurrent: session.isCurrent,
        }),
    );
  }

  async findByDate(date: string, eventId: string): Promise<Session> {
    const session = await this.prismaService.session.findFirst({
      where: {
        date,
        eventId,
      },
    });

    if (!session) return null;

    return new Session({
      id: session.id,
      eventId: session.eventId,
      date: session.date,
      hourStart: session.hourStart,
      hourEnd: session.hourEnd,
      isCurrent: session.isCurrent,
    });
  }

  async findCurrentSession(eventId: string): Promise<Session> {
    const session = await this.prismaService.session.findFirst({
      where: {
        eventId,
        isCurrent: true,
      },
    });

    if (!session) return null;

    return new Session({
      id: session.id,
      eventId: session.eventId,
      date: session.date,
      hourStart: session.hourStart,
      hourEnd: session.hourEnd,
      isCurrent: session.isCurrent,
    });
  }

  async save(session: Session): Promise<void> {
    await this.prismaService.session.create({
      data: {
        eventId: session.eventId,
        date: session.date,
        hourStart: session.hourStart,
        hourEnd: session.hourEnd,
        isCurrent: session.isCurrent,
      },
    });
  }

  async update(session: Session): Promise<void> {
    console.log('update session', session.id);
    await this.prismaService.session.update({
      where: {
        id: session.id,
      },
      data: {
        eventId: session.eventId,
        date: session.date,
        hourStart: session.hourStart,
        hourEnd: session.hourEnd,
        isCurrent: session.isCurrent,
      },
    });
  }
}
