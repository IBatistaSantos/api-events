import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { Session } from '@/modules/sessions/domain/session';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

@Injectable()
export class SessionRepositoryPrisma implements SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findById(id: string): Promise<Session> {
    const session = await this.prismaService.session.findUnique({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!session) return null;

    return new Session({
      id: session.id,
      eventId: session.eventId,
      date: session.date,
      hourStart: session.hourStart,
      hourEnd: session.hourEnd,
      finished: session.finished,
      status: session.status,
      isCurrent: session.isCurrent,
    });
  }
  async listByEventId(eventId: string): Promise<Session[]> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
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
          finished: session.finished,
          status: session.status,
          isCurrent: session.isCurrent,
        }),
    );
  }

  async findByDate(date: string, eventId: string): Promise<Session> {
    const session = await this.prismaService.session.findFirst({
      where: {
        date,
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!session) return null;

    return new Session({
      id: session.id,
      eventId: session.eventId,
      date: session.date,
      hourStart: session.hourStart,
      hourEnd: session.hourEnd,
      finished: session.finished,
      status: session.status,
      isCurrent: session.isCurrent,
    });
  }

  async findCurrentSession(eventId: string): Promise<Session> {
    const session = await this.prismaService.session.findFirst({
      where: {
        eventId,
        status: 'ACTIVE',
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
      finished: session.finished,
      status: session.status,
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
        status: session.status as UserStatus,
        finished: session.finished,
        isCurrent: session.isCurrent,
      },
    });
  }

  async update(session: Session): Promise<void> {
    await this.prismaService.session.update({
      where: {
        id: session.id,
      },
      data: {
        eventId: session.eventId,
        date: session.date,
        hourStart: session.hourStart,
        finished: session.finished,
        status: session.status as UserStatus,
        hourEnd: session.hourEnd,
        isCurrent: session.isCurrent,
      },
    });
  }
}
