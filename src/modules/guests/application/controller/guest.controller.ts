import {
  Body,
  Controller,
  Get,
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
import { ListGuestUseCase } from '../useCases/list-guests.usecase';
import { ImportGuestUseCase } from '../useCases/import-guest.usecase';
import {
  ImportGuestError,
  ImportGuestSuccess,
} from '../useCases/import-guest.usecase';
import { ImportGuestDTO } from './dtos/import-guest.dto';
import { SendRequestGuestUseCase } from '../useCases/send-request-guest.usecase';

@Controller(`${baseRoute.base_url_v1}/guests`)
@ApiTags('guests')
export class GuestController {
  constructor(
    private readonly createGuestUseCase: CreateGuestUseCase,
    private readonly approveGuestUseCase: ApproveGuestUseCase,
    private readonly recuseGuestUseCase: RecuseGuestUseCase,
    private readonly listGuestUseCase: ListGuestUseCase,
    private readonly importGuestUseCase: ImportGuestUseCase,
    private readonly sendRequestGuestUseCase: SendRequestGuestUseCase,
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

  @Post('/import')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The guests have been successfully imported.',
    schema: {
      example: {
        errors: [
          {
            email: 'john@example.com',
            name: 'John Doe',
            error: 'Guest already exists',
          },
        ],
        success: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
        ],
      },
    },
  })
  async importGuests(
    @GetUser() user: any,
    @Body() body: ImportGuestDTO,
  ): Promise<{
    errors: ImportGuestError[];
    success: ImportGuestSuccess[];
  }> {
    return await this.importGuestUseCase.execute({
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

  @Get('/event/:eventId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The guests have been successfully listed.',
    schema: {
      example: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example',
          eventId: '1',
          isConfirmed: false,
          status: 'ACTIVE',
          statusGuest: 'waiting_approved',
          approvedAt: '2021-10-10',
          approvedBy: '1',
          recusedAt: '2021-10-10',
          recusedBy: '1',
          createdAt: '2021-10-10',
          updatedAt: '2021-10-10',
        },
      ],
    },
  })
  async listGuests(@Param('eventId') eventId: string, @GetUser() user: any) {
    const userId = user.id;
    return await this.listGuestUseCase.execute({ eventId, userId });
  }

  @Post('/invite')
  async sendRequestGuest(@Body() body: CreateGuestDTO) {
    return await this.sendRequestGuestUseCase.execute(body);
  }
}
