import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateEventUseCase } from '../useCases/create-event-usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateEventDTO } from './dtos/create-event.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ListEventOutput,
  ListEventUseCase,
} from '../useCases/list-event-usecase';
import {
  DetailsEventOutput,
  DetailsEventUseCase,
} from '../useCases/details-event-usecase';

@Controller(`${baseRoute.base_url_v1}/events`)
@ApiTags('events')
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly listEventUseCase: ListEventUseCase,
    private readonly detailsEventUseCase: DetailsEventUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        url: { type: 'string' },
        inscriptionType: { type: 'string' },
        organizationId: { type: 'string' },
        accountId: { type: 'string' },
        private: { type: 'boolean' },
        featureFlags: {
          type: 'object',
          properties: {
            auth: {
              type: 'object',
              properties: {
                singleAccess: { type: 'boolean' },
                confirmEmail: { type: 'boolean' },
                codeAccess: { type: 'boolean' },
                passwordRequired: { type: 'boolean' },
                emailRequired: { type: 'boolean' },
                captcha: { type: 'boolean' },
              },
            },
            sales: {
              type: 'object',
              properties: {
                tickets: { type: 'boolean' },
                hasInstallments: { type: 'boolean' },
              },
            },
            mail: {
              type: 'object',
              properties: {
                sendMailInscription: { type: 'boolean' },
              },
            },
          },
        },
        status: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  async createEvent(
    @GetUser() user: any,
    @Body() createEventDto: CreateEventDTO,
  ) {
    const userId = user.id;
    const accountId = user.accountId;
    return await this.createEventUseCase.execute({
      ...createEventDto,
      userId,
      accountId,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The events has been successfully listed.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          url: { type: 'string' },
          inscriptionType: { type: 'string' },
          organizationId: { type: 'string' },
          accountId: { type: 'string' },
          private: { type: 'boolean' },
          sessions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                date: { type: 'string' },
                hourEnd: { type: 'string' },
                hourStart: { type: 'string' },
                isCurrent: { type: 'boolean' },
              },
            },
          },
          status: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  })
  async listEvents(
    @GetUser() user: any,
    @Query() organizationId: string,
  ): Promise<ListEventOutput[]> {
    const userId = user.id;
    const accountId = user.accountId;
    return await this.listEventUseCase.execute({
      userId,
      accountId,
      organizationId,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully listed.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        url: { type: 'string' },
        inscriptionType: { type: 'string' },
        organizationId: { type: 'string' },
        accountId: { type: 'string' },
        private: { type: 'boolean' },
        sessions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              date: { type: 'string' },
              start: { type: 'string' },
              end: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
        featureFlags: {
          type: 'object',
          properties: {
            auth: {
              type: 'object',
              properties: {
                singleAccess: { type: 'boolean' },
                confirmEmail: { type: 'boolean' },
                codeAccess: { type: 'boolean' },
                passwordRequired: { type: 'boolean' },
                emailRequired: { type: 'boolean' },
                captcha: { type: 'boolean' },
              },
            },
            sales: {
              type: 'object',
              properties: {
                tickets: { type: 'boolean' },
                hasInstallments: { type: 'boolean' },
              },
            },
            mail: {
              type: 'object',
              properties: {
                sendMailInscription: { type: 'boolean' },
              },
            },
          },
        },
        status: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  async detailsEvent(@Param('id') id: string): Promise<DetailsEventOutput> {
    return await this.detailsEventUseCase.execute(id);
  }
}
