import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestUseCase } from '../useCases/create-guest.usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateGuestDTO } from './dtos/create-guest.dto';

@Controller('guests')
@ApiTags('guests')
export class GuestController {
  constructor(private readonly createGuestUseCase: CreateGuestUseCase) {}

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
}
