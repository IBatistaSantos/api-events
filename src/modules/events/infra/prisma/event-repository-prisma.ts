import { Account } from '@/modules/accounts/domain/account';
import { Organization } from '@/modules/organization/domain/organization';
import { Session } from '@/modules/sessions/domain/session';
import { User } from '@/modules/users/domain/user';
import {
  EventRepository,
  ListEventOutput,
} from '../../application/repository/event.repository';
import { Events } from '../../domain/events';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { EventType, InscriptionType, UserStatus } from '@prisma/client';
import { Permission } from '@/modules/permissions/domain/permission';
import { BadException } from '@/shared/domain/errors/errors';

@Injectable()
export class EventRepositoryPrisma implements EventRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<any> {
    const response = await this.prismaService.event.findUnique({
      where: {
        id,
        status: 'ACTIVE',
      },
      include: {
        featuresFlags: true,
        Session: {
          where: {
            status: 'ACTIVE',
          },
        },
      },
    });

    if (!response) return null;

    const event = new Events({
      accountId: response.accountId,
      name: response.name,
      organizationId: response.organizationId,
      url: response.url,
      id: response.id,
      createdAt: response.createdAt,
      private: response.private,
      inscriptionType: response.incriptionType,
      status: response.status,
      type: response.type,
      updatedAt: response.updatedAt,
      featureFlags: {
        auth: {
          captcha: response.featuresFlags.captcha,
          codeAccess: response.featuresFlags.codeAccess,
          confirmEmail: response.featuresFlags.confirmEmail,
          emailRequired: response.featuresFlags.emailRequired,
          passwordRequired: response.featuresFlags.passwordRequired,
          singleAccess: response.featuresFlags.singleAccess,
        },
        mail: {
          sendMailInscription: response.featuresFlags.sendMailInscription,
        },
        sales: {
          hasInstallments: response.featuresFlags.hasInstallments,
          tickets: response.featuresFlags.ticket,
        },
      },
    });

    const sessions = response.Session.map((session) => {
      return {
        finished: session.finished,
        date: session.date,
        hourEnd: session.hourEnd,
        hourStart: session.hourStart,
        isCurrent: session.isCurrent,
        id: session.id,
      };
    });

    return { event, sessions };
  }

  async list(
    accountId: string,
    organizationId?: string,
  ): Promise<ListEventOutput[]> {
    const events = await this.prismaService.event.findMany({
      where: {
        ...(organizationId && { organizationId }),
        status: 'ACTIVE',
        accountId,
      },
      include: {
        Session: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            date: true,
            hourEnd: true,
            hourStart: true,
            isCurrent: true,
            id: true,
          },
        },
      },
    });

    if (!events) return [];

    return events.map((event) => {
      return {
        accountId: event.accountId,
        name: event.name,
        organizationId: event.organizationId,
        url: event.url,
        id: event.id,
        createdAt: event.createdAt,
        private: event.private,
        inscriptionType: event.incriptionType,
        status: event.status,
        sessions: event.Session.map((session) => {
          return {
            date: session.date,
            hourEnd: session.hourEnd,
            hourStart: session.hourStart,
            isCurrent: session.isCurrent,
            id: session.id,
          };
        }),
        type: event.type,
        updatedAt: event.updatedAt,
      };
    });
  }
  async save(event: Events): Promise<void> {
    const featuresFlags = await this.prismaService.eventFeatureFlag.create({
      data: {
        captcha: event.featureFlags.auth.captcha,
        codeAccess: event.featureFlags.auth.codeAccess,
        confirmEmail: event.featureFlags.auth.confirmEmail,
        emailRequired: event.featureFlags.auth.emailRequired,
        hasInstallments: event.featureFlags.sales.hasInstallments,
        passwordRequired: event.featureFlags.auth.passwordRequired,
        sendMailInscription: event.featureFlags.mail.sendMailInscription,
        singleAccess: event.featureFlags.auth.singleAccess,
      },
    });

    if (!featuresFlags) {
      throw new BadException('Error to create features flags');
    }

    await this.prismaService.event.create({
      data: {
        name: event.name,
        url: event.url,
        id: event.id,
        createdAt: event.createdAt,
        incriptionType: event.inscriptionType as InscriptionType,
        updatedAt: event.updatedAt,
        private: event.private,
        status: event.status as UserStatus,
        type: event.type as EventType,
        featuresFlags: {
          connect: {
            id: featuresFlags.id,
          },
        },
        account: {
          connect: {
            id: event.accountId,
          },
        },
        organization: {
          connect: {
            id: event.organizationId,
          },
        },
      },
    });

    await this.prismaService.event.update({
      where: { id: event.id },
      data: {
        featuresFlags: {
          connect: {
            id: featuresFlags.id,
          },
        },
      },
    });
  }

  async saveSessions(sessions: Session[]): Promise<void> {
    await this.prismaService.session.createMany({
      data: sessions.map((session) => ({
        date: session.date,
        eventId: session.eventId,
        hourEnd: session.hourEnd,
        hourStart: session.hourStart,
        isCurrent: session.isCurrent,
        id: session.id,
      })),
    });
  }

  async countEventsByAccountId(accountId: string): Promise<number> {
    return this.prismaService.event.count({
      where: {
        accountId,
      },
    });
  }

  async findByURL(url: string): Promise<Events> {
    const event = await this.prismaService.event.findUnique({
      where: {
        url,
        status: 'ACTIVE',
      },
      include: { featuresFlags: true },
    });

    if (!event) return null;

    return new Events({
      accountId: event.accountId,
      name: event.name,
      organizationId: event.organizationId,
      url: event.url,
      id: event.id,
      createdAt: event.createdAt,
      private: event.private,
      inscriptionType: event.incriptionType,
      status: event.status,
      type: event.type,
      updatedAt: event.updatedAt,
      featureFlags: {
        auth: {
          captcha: event.featuresFlags.captcha,
          codeAccess: event.featuresFlags.codeAccess,
          confirmEmail: event.featuresFlags.confirmEmail,
          emailRequired: event.featuresFlags.emailRequired,
          passwordRequired: event.featuresFlags.passwordRequired,
          singleAccess: event.featuresFlags.singleAccess,
        },
        mail: {
          sendMailInscription: event.featuresFlags.sendMailInscription,
        },
        sales: {
          hasInstallments: event.featuresFlags.hasInstallments,
          tickets: event.featuresFlags.ticket,
        },
      },
    });
  }

  async findManagerById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        status: 'ACTIVE',
      },
      include: { permissions: { include: { permission: true } } },
    });

    if (!user) return null;

    const permissions = user.permissions.map(({ permission }) => {
      return new Permission({
        content: permission.content as any,
        name: permission.name,
        createdAt: permission.createdAt,
        description: permission.description,
        updatedAt: permission.updatedAt,
        id: permission.id,
      });
    });

    return new User({
      id: user.id,
      accountId: user.accountId,
      email: user.email,
      name: user.name,
      password: user.password,
      permissions,
      status: user.status,
      type: user.type,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findOrganizationById(id: string): Promise<Organization> {
    const organization = await this.prismaService.organization.findUnique({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!organization) return null;

    return new Organization({
      id: organization.id,
      name: organization.name,
      status: organization.status,
      accountId: organization.accountId,
      createdBy: organization.createdBy,
      description: organization.description,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    });
  }

  async findAccountById(id: string): Promise<Account> {
    const account = await this.prismaService.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) return null;

    return new Account({
      id: account.id,
      type: account.type,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      accountPermissions: {
        campaign: account.campaign,
        certificate: account.certificate,
        checkIn: account.checkin,
        event: account.event,
        lobby: account.lobby,
        organization: account.organization,
        videoLibrary: account.videoLibrary,
      },
    });
  }
}
