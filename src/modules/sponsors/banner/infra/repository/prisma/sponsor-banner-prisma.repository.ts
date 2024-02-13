import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { SponsorBanner } from '../../../domain/sponsor-banner';
import { SponsorBannerRepository } from '../../../repository/sponsor-banner.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SponsorBannerPrismaRepository implements SponsorBannerRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findByEventId(eventId: string): Promise<SponsorBanner> {
    const sponsorBanner = await this.prismaService.sponsorBanner.findFirst({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });

    return new SponsorBanner(sponsorBanner);
  }
  async findById(id: string): Promise<SponsorBanner> {
    const sponsorBanner = await this.prismaService.sponsorBanner.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    return new SponsorBanner(sponsorBanner);
  }

  async save(sponsorBanner: SponsorBanner): Promise<void> {
    await this.prismaService.sponsorBanner.create({
      data: {
        id: sponsorBanner.id,
        url: sponsorBanner.url,
        desktop: sponsorBanner.desktop,
        mobile: sponsorBanner.mobile,
        tablet: sponsorBanner.tablet,
        eventId: sponsorBanner.eventId,
        status: sponsorBanner.status as any,
        createdAt: sponsorBanner.createdAt,
        updatedAt: sponsorBanner.updatedAt,
        deletedAt: sponsorBanner.deletedAt,
      },
    });
  }

  async update(sponsorBanner: SponsorBanner): Promise<void> {
    await this.prismaService.sponsorBanner.update({
      where: {
        id: sponsorBanner.id,
      },
      data: {
        url: sponsorBanner.url,
        desktop: sponsorBanner.desktop,
        mobile: sponsorBanner.mobile,
        tablet: sponsorBanner.tablet,
        eventId: sponsorBanner.eventId,
        status: sponsorBanner.status as any,
        createdAt: sponsorBanner.createdAt,
        updatedAt: sponsorBanner.updatedAt,
        deletedAt: sponsorBanner.deletedAt,
      },
    });
  }
}
