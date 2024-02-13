import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { SponsorBanner } from '../domain/sponsor-banner';
import { NotFoundException } from '@/shared/domain/errors/errors';

interface CreateBannerInput {
  url: string;
  desktop: string;
  mobile: string;
  tablet: string;
  eventId: string;
}

type UpdateBannerInput = Partial<Omit<CreateBannerInput, 'eventId'>>;

@Injectable()
export class SponsorBannerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(params: CreateBannerInput) {
    const { url, desktop, mobile, tablet, eventId } = params;

    const sponsorBanner = new SponsorBanner({
      url,
      desktop,
      mobile,
      tablet,
      eventId,
    });

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

    return sponsorBanner.toJSON();
  }

  async update(bannerId: string, params: UpdateBannerInput) {
    const sponsorBanner = await this.prismaService.sponsorBanner.findUnique({
      where: {
        id: bannerId,
        status: 'ACTIVE',
      },
    });

    if (!sponsorBanner) {
      throw new NotFoundException(
        'A configuração do banner não foi encontrada',
      );
    }

    const sponsorBannerInstance = new SponsorBanner({
      url: sponsorBanner.url,
      desktop: sponsorBanner.desktop,
      mobile: sponsorBanner.mobile,
      tablet: sponsorBanner.tablet,
      eventId: sponsorBanner.eventId,
      status: sponsorBanner.status,
      createdAt: sponsorBanner.createdAt,
      updatedAt: sponsorBanner.updatedAt,
      deletedAt: sponsorBanner.deletedAt,
    });

    sponsorBannerInstance.update(params);

    await this.prismaService.sponsorBanner.update({
      where: {
        id: bannerId,
      },
      data: {
        url: sponsorBannerInstance.url,
        desktop: sponsorBannerInstance.desktop,
        mobile: sponsorBannerInstance.mobile,
        tablet: sponsorBannerInstance.tablet,
        eventId: sponsorBannerInstance.eventId,
        status: sponsorBannerInstance.status as any,
        updatedAt: sponsorBannerInstance.updatedAt,
      },
    });

    return sponsorBannerInstance.toJSON();
  }

  async delete(bannerId: string) {
    const sponsorBanner = await this.prismaService.sponsorBanner.findUnique({
      where: {
        id: bannerId,
      },
    });

    if (!sponsorBanner) {
      throw new NotFoundException(
        'A configuração do banner não foi encontrada',
      );
    }

    const sponsorBannerInstance = new SponsorBanner({
      url: sponsorBanner.url,
      desktop: sponsorBanner.desktop,
      mobile: sponsorBanner.mobile,
      tablet: sponsorBanner.tablet,
      eventId: sponsorBanner.eventId,
      status: sponsorBanner.status,
      createdAt: sponsorBanner.createdAt,
      updatedAt: sponsorBanner.updatedAt,
      deletedAt: sponsorBanner.deletedAt,
    });

    sponsorBannerInstance.delete();

    await this.prismaService.sponsorBanner.update({
      where: {
        id: bannerId,
      },
      data: {
        deletedAt: sponsorBannerInstance.deletedAt,
        status: sponsorBannerInstance.status as any,
      },
    });

    return sponsorBannerInstance.toJSON();
  }

  async show(eventId: string) {
    const sponsorBanners = await this.prismaService.sponsorBanner.findFirst({
      where: {
        eventId,
        status: 'ACTIVE',
      },
    });

    if (!sponsorBanners) {
      throw new NotFoundException('Nenhum banner foi encontrado');
    }

    const sponsorBannerInstance = new SponsorBanner({
      url: sponsorBanners.url,
      desktop: sponsorBanners.desktop,
      mobile: sponsorBanners.mobile,
      tablet: sponsorBanners.tablet,
      eventId: sponsorBanners.eventId,
      status: sponsorBanners.status,
      createdAt: sponsorBanners.createdAt,
      updatedAt: sponsorBanners.updatedAt,
      deletedAt: sponsorBanners.deletedAt,
    });

    return sponsorBannerInstance.toJSON();
  }
}
