import { Events } from '@/modules/events/domain/events';
import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { Organization } from '@/modules/organization/domain/organization';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { GuestStatus, UserStatus } from '@prisma/client';

@Injectable()
export class GuestPrismaRepository implements GuestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findEvent(eventId: string): Promise<Events> {
    const response = await this.prisma.event.findUnique({
      where: {
        id: eventId,
        status: 'ACTIVE',
      },
      include: {
        featuresFlags: true,
      },
    });

    if (!response) {
      return null;
    }

    return new Events({
      id: response.id,
      name: response.name,
      organizationId: response.organizationId,
      url: response.url,
      inscriptionType: response.incriptionType,
      type: response.type,
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
      private: response.private,
      accountId: response.accountId,
      status: response.status,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  }

  async findApprovedGuest(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        status: 'ACTIVE',
      },
      include: {
        organizations: true,
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status as UserStatus,
      accountId: user.accountId,
      type: user.type,
      organizations: user.organizations.map((organization) => {
        return new Organization({
          accountId: organization.accountId,
          createdBy: organization.createdBy,
          name: organization.name,
          createdAt: organization.createdAt,
          description: organization.description,
          id: organization.id,
          status: organization.status,
          updatedAt: organization.updatedAt,
        });
      }),
      permissions: user.permissions.map(({ permission }) => {
        return new Permission({
          content: permission.content as any,
          name: permission.name,
          createdAt: permission.createdAt,
          description: permission.description,
          id: permission.id,
          updatedAt: permission.updatedAt,
        });
      }),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmails(emails: string[], eventId: string): Promise<Guest[]> {
    const guests = await this.prisma.guest.findMany({
      where: {
        email: {
          in: emails,
        },
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!guests || !guests.length) {
      return [];
    }

    return guests.map(
      (guest) =>
        new Guest({
          id: guest.id,
          name: guest.name,
          email: guest.email,
          eventId: guest.eventId,
          isConfirmed: guest.isConfirmed,
          statusGuest: guest.statusGuest,
          status: guest.status,
          approvedAt: guest.approvedAt,
          approvedBy: guest.approvedBy,
          recusedAt: guest.recusedAt,
          recusedBy: guest.recusedBy,
          createdAt: guest.createdAt,
          updatedAt: guest.updatedAt,
        }),
    );
  }
  async listByEventId(eventId: string): Promise<Guest[]> {
    const guests = await this.prisma.guest.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!guests || !guests.length) {
      return [];
    }

    return guests.map(
      (guest) =>
        new Guest({
          id: guest.id,
          name: guest.name,
          email: guest.email,
          eventId: guest.eventId,
          isConfirmed: guest.isConfirmed,
          statusGuest: guest.statusGuest,
          status: guest.status,
          approvedAt: guest.approvedAt,
          approvedBy: guest.approvedBy,
          recusedAt: guest.recusedAt,
          recusedBy: guest.recusedBy,
          createdAt: guest.createdAt,
          updatedAt: guest.updatedAt,
        }),
    );
  }
  async findById(id: string): Promise<Guest> {
    const guest = await this.prisma.guest.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!guest) {
      return null;
    }

    return new Guest({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      eventId: guest.eventId,
      isConfirmed: guest.isConfirmed,
      statusGuest: guest.statusGuest,
      status: guest.status,
      approvedAt: guest.approvedAt,
      approvedBy: guest.approvedBy,
      recusedAt: guest.recusedAt,
      recusedBy: guest.recusedBy,
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    });
  }

  async findByEmail(email: string, eventId: string): Promise<Guest> {
    const guest = await this.prisma.guest.findFirst({
      where: {
        email,
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!guest) {
      return null;
    }

    return new Guest({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      eventId: guest.eventId,
      isConfirmed: guest.isConfirmed,
      statusGuest: guest.statusGuest,
      status: guest.status,
      approvedAt: guest.approvedAt,
      approvedBy: guest.approvedBy,
      recusedAt: guest.recusedAt,
      recusedBy: guest.recusedBy,
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    });
  }

  async save(guest: Guest): Promise<void> {
    await this.prisma.guest.create({
      data: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        eventId: guest.eventId,
        isConfirmed: guest.isConfirmed,
        statusGuest: guest.statusGuest as GuestStatus,
        status: guest.status as UserStatus,
        approvedAt: guest.approvedAt,
        approvedBy: guest.approvedBy,
        recusedAt: guest.recusedAt,
        recusedBy: guest.recusedBy,
        createdAt: guest.createdAt,
        updatedAt: guest.updatedAt,
      },
    });
  }
}
