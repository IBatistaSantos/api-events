import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { GuestStatus, UserStatus } from '@prisma/client';

@Injectable()
export class GuestPrismaRepository implements GuestRepository {
  constructor(private readonly prisma: PrismaService) {}
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
  async findByEmail(email: string): Promise<Guest> {
    const guest = await this.prisma.guest.findFirst({
      where: {
        email,
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
