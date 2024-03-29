import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

@Injectable()
export class PanelistPrismaRepository implements PanelistRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findByIds(ids: string[]): Promise<Panelist[]> {
    const panelists = await this.prismaService.panelist.findMany({
      where: {
        id: {
          in: ids,
        },
        status: 'ACTIVE',
      },
    });

    if (!panelists || !panelists.length) return [];

    return panelists.map(
      (panelist) =>
        new Panelist({
          id: panelist.id,
          name: panelist.name,
          email: panelist.email,
          eventId: panelist.eventId,
          office: panelist.office,
          description: panelist.description,
          colorPrincipal: panelist.colorPrincipal,
          createdAt: panelist.createdAt,
          increaseSize: panelist.increaseSize,
          position: panelist.position,
          isPrincipal: panelist.isPrincipal,
          photo: panelist.photo,
          sectionName: panelist.sectionName,
          status: panelist.status as UserStatus,
          updatedAt: panelist.updatedAt,
        }),
    );
  }
  async updateMany(panelists: Panelist[]): Promise<void> {
    await this.prismaService.panelist.updateMany({
      where: {
        id: {
          in: panelists.map((panelist) => panelist.id),
        },
        status: 'ACTIVE',
      },
      data: panelists.map((panelist) => ({
        name: panelist.name,
        email: panelist.email,
        eventId: panelist.eventId,
        office: panelist.office,
        description: panelist.description,
        colorPrincipal: panelist.colorPrincipal,
        createdAt: panelist.createdAt,
        increaseSize: panelist.increaseSize,
        position: panelist.position,
        isPrincipal: panelist.isPrincipal,
        photo: panelist.photo,
        sectionName: panelist.sectionName,
        status: panelist.status as UserStatus,
        updatedAt: panelist.updatedAt,
      })),
    });
  }

  async findByEventId(eventId: string): Promise<Panelist[]> {
    const panelists = await this.prismaService.panelist.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!panelists || !panelists.length) return [];

    return panelists.map(
      (panelist) =>
        new Panelist({
          id: panelist.id,
          name: panelist.name,
          email: panelist.email,
          eventId: panelist.eventId,
          office: panelist.office,
          description: panelist.description,
          colorPrincipal: panelist.colorPrincipal,
          createdAt: panelist.createdAt,
          position: panelist.position,
          increaseSize: panelist.increaseSize,
          isPrincipal: panelist.isPrincipal,
          photo: panelist.photo,
          sectionName: panelist.sectionName,
          status: panelist.status as UserStatus,
          updatedAt: panelist.updatedAt,
        }),
    );
  }

  async findById(id: string): Promise<Panelist> {
    const panelists = await this.prismaService.panelist.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!panelists) return null;

    return new Panelist({
      id: panelists.id,
      name: panelists.name,
      email: panelists.email,
      eventId: panelists.eventId,
      office: panelists.office,
      description: panelists.description,
      colorPrincipal: panelists.colorPrincipal,
      position: panelists.position,
      createdAt: panelists.createdAt,
      increaseSize: panelists.increaseSize,
      isPrincipal: panelists.isPrincipal,
      photo: panelists.photo,
      sectionName: panelists.sectionName,
      status: panelists.status as UserStatus,
      updatedAt: panelists.updatedAt,
    });
  }

  async findByEmail(email: string, eventId: string): Promise<Panelist> {
    const panelists = await this.prismaService.panelist.findFirst({
      where: {
        email,
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!panelists) return null;

    return new Panelist({
      id: panelists.id,
      name: panelists.name,
      email: panelists.email,
      eventId: panelists.eventId,
      office: panelists.office,
      description: panelists.description,
      colorPrincipal: panelists.colorPrincipal,
      createdAt: panelists.createdAt,
      increaseSize: panelists.increaseSize,
      position: panelists.position,
      isPrincipal: panelists.isPrincipal,
      photo: panelists.photo,
      sectionName: panelists.sectionName,
      status: panelists.status,
      updatedAt: panelists.updatedAt,
    });
  }

  async countByEventId(eventId: string): Promise<number> {
    return await this.prismaService.panelist.count({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });
  }

  async save(panelist: Panelist): Promise<void> {
    await this.prismaService.panelist.create({
      data: {
        id: panelist.id,
        name: panelist.name,
        email: panelist.email,
        eventId: panelist.eventId,
        office: panelist.office,
        description: panelist.description,
        colorPrincipal: panelist.colorPrincipal,
        createdAt: panelist.createdAt,
        increaseSize: panelist.increaseSize,
        isPrincipal: panelist.isPrincipal,
        photo: panelist.photo,
        sectionName: panelist.sectionName,
        status: panelist.status as UserStatus,
        updatedAt: panelist.updatedAt,
      },
    });
  }

  async update(panelist: Panelist): Promise<void> {
    await this.prismaService.panelist.update({
      where: {
        id: panelist.id,
      },
      data: {
        name: panelist.name,
        email: panelist.email,
        eventId: panelist.eventId,
        office: panelist.office,
        description: panelist.description,
        colorPrincipal: panelist.colorPrincipal,
        createdAt: panelist.createdAt,
        increaseSize: panelist.increaseSize,
        position: panelist.position,
        isPrincipal: panelist.isPrincipal,
        photo: panelist.photo,
        sectionName: panelist.sectionName,
        status: panelist.status as UserStatus,
        updatedAt: panelist.updatedAt,
      },
    });
  }
}
