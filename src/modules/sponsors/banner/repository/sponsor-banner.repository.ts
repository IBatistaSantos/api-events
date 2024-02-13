import { SponsorBanner } from '@/modules/sponsors/banner/domain/sponsor-banner';

export interface SponsorBannerRepository {
  findByEventId(eventId: string): Promise<SponsorBanner | null>;
  findById(id: string): Promise<SponsorBanner | null>;
  save(sponsorBanner: SponsorBanner): Promise<void>;
  update(sponsorBanner: SponsorBanner): Promise<void>;
}
