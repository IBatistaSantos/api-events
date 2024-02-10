import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateLiveUseCase } from '../useCases/create-live.usecase';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateLiveDTO } from './dtos/create-live.dto';
import { DetailsLiveUseCase } from '../useCases/details-live.usecase';
import { ListLiveSessionIdUseCase } from '../useCases/list-live-sessionId.usecase';
import { RemoveLiveUseCase } from '../useCases/remove-live.usecase';
import { FinishLiveUseCase } from '../useCases/finish-live.usecase';
import { FinishLiveDTO } from './dtos/finish-live.dto';
import { UpdateLiveUseCase } from '../useCases/update-live.usecase';
import { UpdateLiveDTO } from './dtos/update-live.dto';
import { DisableChatLiveUseCase } from '../useCases/disable-chat-live.usecase';
import { DisableReactionLiveUseCase } from '../useCases/disable-reaction-live.usecase';
import { ReloadLiveUseCase } from '../useCases/reload-live.usecase';

@Controller(`${baseRoute.base_url_v1}/lives`)
@ApiTags('lives')
export class LiveController {
  constructor(
    private readonly createLiveUseCase: CreateLiveUseCase,
    private readonly detailsLiveUseCase: DetailsLiveUseCase,
    private readonly listLiveSessionIdUseCase: ListLiveSessionIdUseCase,
    private readonly deleteLiveUseCase: RemoveLiveUseCase,
    private readonly finishLiveUseCase: FinishLiveUseCase,
    private readonly updateLiveUseCase: UpdateLiveUseCase,
    private readonly disableChatLiveUseCase: DisableChatLiveUseCase,
    private readonly disableReactionLiveUseCase: DisableReactionLiveUseCase,
    private readonly reloadLiveUseCase: ReloadLiveUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The live has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-rwer-12d3-a456-426614174000',
        },

        sessionId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-r',
        },
        link: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=123456',
        },
        typeLink: {
          type: 'string',
          example: 'YOUTUBE',
          enum: ['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'],
        },
        isMain: {
          type: 'boolean',
          example: true,
        },
        title: {
          type: 'string',
          example: 'Title of the live',
        },
        chat: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Title of the live',
            },
            type: {
              type: 'string',
              example: 'open',
              enum: ['open', 'moderate'],
            },
          },
        },
        translation: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                example: 'pt',
              },
              link: {
                type: 'string',
                example: 'https://www.youtube.com/watch?v=123456',
              },
              text: {
                type: 'string',
                example: 'Title of the live',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'The live could not be created.',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Session not found',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async createLive(@Body() body: CreateLiveDTO) {
    return this.createLiveUseCase.execute(body);
  }

  @Get('/:liveId')
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async detailsLive(@Param('liveId') liveId: string) {
    return this.detailsLiveUseCase.execute(liveId);
  }

  @Get('/events/:eventId')
  @ApiParam({
    name: 'eventId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The live has been successfully listed.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          sessionId: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          link: {
            type: 'string',
            example: 'https://www.youtube.com/watch?v=123456',
          },
          typeLink: {
            type: 'string',
            example: 'YOUTUBE',
            enum: ['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'],
          },
          isMain: {
            type: 'boolean',
            example: true,
          },
          title: {
            type: 'string',
            example: 'Title of the live',
          },
          chat: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                example: 'Title of the live',
              },
              type: {
                type: 'string',
                example: 'open',
                enum: ['open', 'moderate'],
              },
            },
          },
          translation: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {
                  type: 'string',
                  example: 'pt',
                },
                link: {
                  type: 'string',
                  example: 'https://www.youtube.com/watch?v=123456',
                },
                text: {
                  type: 'string',
                  example: 'Title of the live',
                },
              },
            },
          },
        },
      },
    },
  })
  async listLiveSessionId(@Param('eventId') eventId: string) {
    return this.listLiveSessionIdUseCase.execute({ eventId });
  }

  @Delete('/:liveId')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async deleteLive(@Param('liveId') liveId: string) {
    return this.deleteLiveUseCase.execute(liveId);
  }

  @Put('/:liveId')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The live has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        sessionId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        link: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=123456',
        },
        typeLink: {
          type: 'string',
          example: 'YOUTUBE',
          enum: ['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'],
        },
        isMain: {
          type: 'boolean',
          example: true,
        },
        title: {
          type: 'string',
          example: 'Title of the live',
        },
        chat: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Title of the live',
            },
            type: {
              type: 'string',
              example: 'open',
              enum: ['open', 'moderate'],
            },
          },
        },
        translation: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                example: 'pt',
              },
              link: {
                type: 'string',
                example: 'https://www.youtube.com/watch?v=123456',
              },
              text: {
                type: 'string',
                example: 'Title of the live',
              },
            },
          },
        },
      },
    },
  })
  async updateLive(
    @Param('liveId') liveId: string,
    @Body() body: UpdateLiveDTO,
  ) {
    return this.updateLiveUseCase.execute({
      liveId,
      data: body,
    });
  }

  @Patch('/:liveId/finish')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async finishLive(
    @Param('liveId') liveId: string,
    @Body() body: FinishLiveDTO,
  ) {
    return this.finishLiveUseCase.execute({
      liveId,
      finishedAt: body.finishedAt,
    });
  }

  @Patch('/:liveId/chat/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async disableChatLive(@Param('liveId') liveId: string) {
    return this.disableChatLiveUseCase.execute(liveId);
  }

  @Patch('/:liveId/reaction/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async disableReactionLive(@Param('liveId') liveId: string) {
    return this.disableReactionLiveUseCase.execute(liveId);
  }

  @Patch('/:liveId/reload')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'liveId',
    type: 'string',
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async reloadLive(@Param('liveId') liveId: string) {
    return this.reloadLiveUseCase.execute(liveId);
  }
}
