import { Module } from '@nestjs/common';
import { SponsorController } from './application/controller/sponsor.controller';
import { SponsorBannerService } from './banner/services/sponsor-banner';
import { SponsorBannerPrismaRepository } from './banner/infra/repository/prisma/sponsor-banner-prisma.repository';

@Module({
  imports: [],
  controllers: [SponsorController],
  providers: [
    SponsorBannerService,
    {
      provide: 'SponsorBannerRepository',
      useClass: SponsorBannerPrismaRepository,
    },
  ],
  exports: [],
})
export class SponsorModule {}
