import { Inject, Injectable } from '@nestjs/common';
import { SponsorBanner } from '../domain/sponsor-banner';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { SponsorBannerRepository } from '../repository/sponsor-banner.repository';

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
  constructor(
    @Inject('SponsorBannerRepository')
    private readonly repository: SponsorBannerRepository,
  ) {}

  async create(params: CreateBannerInput) {
    const { url, desktop, mobile, tablet, eventId } = params;

    const exists = await this.repository.findByEventId(eventId);

    if (exists) {
      throw new BadException('Já existe um banner para este evento');
    }

    const sponsorBanner = new SponsorBanner({
      url,
      desktop,
      mobile,
      tablet,
      eventId,
    });

    await this.repository.save(sponsorBanner);

    return sponsorBanner.toJSON();
  }

  async update(bannerId: string, params: UpdateBannerInput) {
    const sponsorBanner = await this.repository.findById(bannerId);

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

    await this.repository.update(sponsorBannerInstance);
    return sponsorBannerInstance.toJSON();
  }

  async delete(bannerId: string) {
    const sponsorBanner = await this.repository.findById(bannerId);

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

    await this.repository.update(sponsorBannerInstance);

    return sponsorBannerInstance.toJSON();
  }

  async show(eventId: string) {
    const sponsorBanners = await this.repository.findByEventId(eventId);

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
