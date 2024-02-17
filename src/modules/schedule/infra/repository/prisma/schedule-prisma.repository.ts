import { Events } from '@/modules/events/domain/events';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { Schedule } from '@/modules/schedule/domain/schedule';
import { Session } from '@/modules/sessions/domain/session';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulePrismaRepository implements ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findEventById(eventId: string): Promise<Events> {
    const response = await this.prisma.event.findUnique({
      where: { id: eventId, status: 'ACTIVE' },
      include: { featuresFlags: true },
    });

    if (!response) {
      throw new Error('Event not found');
    }

    return new Events({
      accountId: response.accountId,
      name: response.name,
      organizationId: response.organizationId,
      url: response.url,
      createdAt: response.createdAt,
      id: response.id,
      status: response.status,
      type: response.type,
      updatedAt: response.updatedAt,
      private: response.private,
      inscriptionType: response.incriptionType,
      featureFlags: {
        auth: {
          captcha: response.featuresFlags?.captcha,
          codeAccess: response.featuresFlags?.codeAccess,
          confirmEmail: response.featuresFlags?.confirmEmail,
          emailRequired: response.featuresFlags?.emailRequired,
          passwordRequired: response.featuresFlags?.passwordRequired,
          singleAccess: response.featuresFlags?.singleAccess,
        },
        mail: {
          sendMailInscription: response.featuresFlags?.sendMailInscription,
        },
        sales: {
          hasInstallments: response.featuresFlags?.hasInstallments,
          tickets: response.featuresFlags?.ticket,
        },
      },
    });
  }

  async findSessionById(sessionId: string): Promise<Session> {
    const response = await this.prisma.session.findUnique({
      where: { id: sessionId, status: 'ACTIVE' },
    });

    if (!response) {
      return null;
    }

    return new Session({
      eventId: response.eventId,
      id: response.id,
      date: response.date,
      hourStart: response.hourStart,
      finished: response.finished,
      hourEnd: response.hourEnd,
      isCurrent: response.isCurrent,
      status: response.status,
    });
  }

  async findPanelistByIds(
    panelistIds: string[],
    eventId: string,
  ): Promise<Panelist[]> {
    const response = await this.prisma.panelist.findMany({
      where: {
        id: {
          in: panelistIds,
        },
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!response || !response.length) {
      return [];
    }

    return response.map(
      (panelist) =>
        new Panelist({
          email: panelist.email,
          eventId: panelist.eventId,
          name: panelist.name,
          office: panelist.office,
          colorPrincipal: panelist.colorPrincipal,
          createdAt: panelist.createdAt,
          description: panelist.description,
          id: panelist.id,
          increaseSize: panelist.increaseSize,
          isPrincipal: panelist.isPrincipal,
          photo: panelist.photo,
          position: panelist.position,
          sectionName: panelist.sectionName,
          status: panelist.status,
          updatedAt: panelist.updatedAt,
        }),
    );
  }

  async findByEventId(eventId: string): Promise<Schedule[]> {
    const response = await this.prisma.schedule.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
      },
      orderBy: {
        position: 'asc',
      },
    });

    if (!response || !response.length) {
      return [];
    }

    return response.map(
      (schedule) =>
        new Schedule({
          eventId: schedule.eventId,
          id: schedule.id,
          description: schedule.description,
          hourEnd: schedule.hourEnd,
          hourStart: schedule.hourStart,
          position: schedule.position,
          sessionId: schedule.sessionId,
          status: schedule.status,
          title: schedule.title,
          type: schedule.type,
          panelist: [],
        }),
    );
  }

  async findById(scheduleId: string): Promise<Schedule> {
    const response = await this.prisma.schedule.findUnique({
      where: {
        id: scheduleId,
        status: 'ACTIVE',
      },
    });

    if (!response) {
      return null;
    }

    return new Schedule({
      eventId: response.eventId,
      id: response.id,
      description: response.description,
      hourEnd: response.hourEnd,
      hourStart: response.hourStart,
      position: response.position,
      sessionId: response.sessionId,
      status: response.status,
      title: response.title,
      type: response.type,
      panelist: [],
    });
  }

  async findByIds(scheduleIds: string[], eventId: string): Promise<Schedule[]> {
    const response = await this.prisma.schedule.findMany({
      where: {
        id: {
          in: scheduleIds,
        },
        eventId,
        status: 'ACTIVE',
      },
      orderBy: {
        position: 'asc',
      },
    });

    if (!response || !response.length) {
      return [];
    }

    return response.map(
      (schedule) =>
        new Schedule({
          eventId: schedule.eventId,
          id: schedule.id,
          description: schedule.description,
          hourEnd: schedule.hourEnd,
          hourStart: schedule.hourStart,
          position: schedule.position,
          sessionId: schedule.sessionId,
          status: schedule.status,
          title: schedule.title,
          type: schedule.type,
          panelist: [],
        }),
    );
  }

  async save(schedule: Schedule): Promise<void> {
    await this.prisma.schedule.create({
      data: {
        eventId: schedule.eventId,
        id: schedule.id,
        description: schedule.description,
        hourEnd: schedule.hourEnd,
        hourStart: schedule.hourStart,
        position: schedule.position,
        sessionId: schedule.sessionId,
        status: schedule.status as any,
        title: schedule.title,
        type: schedule.type as any,
      },
    });
  }

  async update(schedule: Schedule): Promise<void> {
    await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        eventId: schedule.eventId,
        description: schedule.description,
        hourEnd: schedule.hourEnd,
        hourStart: schedule.hourStart,
        position: schedule.position,
        sessionId: schedule.sessionId,
        status: schedule.status as any,
        title: schedule.title,
        type: schedule.type as any,
      },
    });
  }

  async updateMany(schedules: Schedule[]): Promise<void> {
    for (const schedule of schedules) {
      await this.prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          eventId: schedule.eventId,
          description: schedule.description,
          hourEnd: schedule.hourEnd,
          hourStart: schedule.hourStart,
          position: schedule.position,
          sessionId: schedule.sessionId,
          status: schedule.status as any,
          title: schedule.title,
          type: schedule.type as any,
        },
      });
    }
  }
}
