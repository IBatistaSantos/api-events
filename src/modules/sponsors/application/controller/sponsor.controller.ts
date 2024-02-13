import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SponsorBannerService } from '../../banner/services/sponsor-banner';
import { AuthGuard } from '@nestjs/passport';
import { CreateSponsorBannerDto } from './dtos/banner/create-sponsor-banner.dto';
import { UpdateSponsorBannerDto } from './dtos/banner/update-sponsor-banner.dto';
import baseRoute from '@/config/routes/base-route';

@Controller(`${baseRoute.base_url_v1}/sponsors`)
@ApiTags('sponsors')
export class SponsorController {
  constructor(private readonly sponsorBannerService: SponsorBannerService) {}

  @Post('/banner/event/:eventId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Banner criado com sucesso',
    schema: {
      example: {
        id: '1',
        url: 'https://www.google.com',
        desktop: 'desktop-image.jpg',
        mobile: 'mobile-image.jpg',
        tablet: 'tablet-image.jpg',
        eventId: '1',
        status: 'ACTIVE',
        createdAt: '2021-08-10T19:00:00.000Z',
        updatedAt: '2021-08-10T19:00:00.000Z',
      },
    },
  })
  async createBanner(
    @Body() sponsor: CreateSponsorBannerDto,
    @Param('eventId') eventId: string,
  ) {
    return this.sponsorBannerService.create({
      url: sponsor.url,
      desktop: sponsor.desktop,
      eventId,
      mobile: sponsor.mobile,
      tablet: sponsor.tablet,
    });
  }

  @Get('/banner/event/:eventId')
  async showBanner(@Param('eventId') eventId: string) {
    return this.sponsorBannerService.show(eventId);
  }

  @Put('/banner/:id')
  async update(
    @Param('id') id: string,
    @Body() sponsor: UpdateSponsorBannerDto,
  ) {
    return this.sponsorBannerService.update(id, sponsor);
  }

  @Delete('/banner/:id')
  async remove(@Param('id') id: string) {
    return this.sponsorBannerService.delete(id);
  }
}
