import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestUseCase } from '../useCases/create-guest.usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateGuestDTO } from './dtos/create-guest.dto';
import baseRoute from '@/config/routes/base-route';
import { ApproveGuestUseCase } from '../useCases/approve-guest.usecase';
import { RecuseGuestUseCase } from '../useCases/recuse-guest.usecase';

@Controller(`${baseRoute.base_url_v1}/guests`)
@ApiTags('guests')
export class GuestController {
  constructor(
    private readonly createGuestUseCase: CreateGuestUseCase,
    private readonly approveGuestUseCase: ApproveGuestUseCase,
    private readonly recuseGuestUseCase: RecuseGuestUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The guest has been successfully created.',
    schema: {
      example: {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        eventId: '1',
        status: 'ACTIVE',
        approvedAt: '2021-10-10',
        isConfirmed: false,
        approvedBy: '1',
        createdAt: '2021-10-10',
        updatedAt: '2021-10-10',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'The guest already exists.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Guest already exists',
        error: 'Bad Request',
      },
    },
  })
  async createGuest(@GetUser() user: any, @Body() body: CreateGuestDTO) {
    return await this.createGuestUseCase.execute({
      approvedBy: user.id,
      ...body,
    });
  }

  @Patch('/:guestId/approve')
  @UseGuards(AuthGuard('jwt'))
  async approveGuest(@GetUser() user: any, @Param('guestId') guestId: string) {
    return await this.approveGuestUseCase.execute({
      guestId,
      approvedBy: user.id,
    });
  }

  @Patch('/:guestId/recuse')
  @UseGuards(AuthGuard('jwt'))
  async recuseGuest(@GetUser() user: any, @Param('guestId') guestId: string) {
    return await this.recuseGuestUseCase.execute({
      guestId,
      recusedBy: user.id,
    });
  }
}
