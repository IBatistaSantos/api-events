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
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateVotingUseCase } from '../useCases/create-voting.usecase';
import { UpdateVotingUseCase } from '../useCases/update-voting.usecase';
import { DeleteVotingUseCase } from '../useCases/delete-voting.usecase';
import { ListVotingUseCase } from '../useCases/list-voting.usecase';
import { FinishVotingUseCase } from '../useCases/finish-voting.usecase';
import { ActivateVotingUseCase } from '../useCases/actived-voting.usecase';

import { CreateVotingDTO } from './dtos/create-voting.dto';
import { UpdateVotingDTO } from './dtos/update-voting.dto';

@Controller(`${baseRoute.base_url_v1}/votings`)
@ApiTags('votings')
export class VotingController {
  constructor(
    private readonly createVotingUseCase: CreateVotingUseCase,
    private readonly updateVotingUseCase: UpdateVotingUseCase,
    private readonly deleteVotingUseCase: DeleteVotingUseCase,
    private readonly listVotingsUseCase: ListVotingUseCase,
    private readonly finishVotingUseCase: FinishVotingUseCase,
    private readonly activateVotingUseCase: ActivateVotingUseCase,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('live/:liveId')
  @ApiResponse({
    status: 200,
    description: 'List of votings',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          targetAudience: { type: 'string' },
          liveId: { type: 'string' },
          questions: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['single-choice', 'multiple-choice', 'text'],
                  },
                  options: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
          activated: { type: 'boolean' },
          timeInSeconds: { type: 'number' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  })
  async listVotings(@Param('liveId') liveId: string) {
    return await this.listVotingsUseCase.execute({
      liveId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Voting created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        targetAudience: { type: 'string' },
        liveId: { type: 'string' },
        questions: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                type: {
                  type: 'string',
                  enum: ['single-choice', 'multiple-choice', 'text'],
                },
                options: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
        activated: { type: 'boolean' },
        timeInSeconds: { type: 'number' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        status: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  async createVoting(@Body() voting: CreateVotingDTO) {
    return await this.createVotingUseCase.execute(voting);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Voting updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        targetAudience: { type: 'string' },
        liveId: { type: 'string' },
        questions: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                type: {
                  type: 'string',
                  enum: ['single-choice', 'multiple-choice', 'text'],
                },
                options: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
        activated: { type: 'boolean' },
        timeInSeconds: { type: 'number' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        status: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  async updateVoting(@Body() voting: UpdateVotingDTO, @Param('id') id: string) {
    return await this.updateVotingUseCase.execute({
      votingId: id,
      params: voting,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/finish')
  @ApiParam({ name: 'id', type: 'string' })
  async finishVoting(@Param('id') id: string) {
    return await this.finishVotingUseCase.execute({ votingId: id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/activate')
  @ApiParam({ name: 'id', type: 'string' })
  async activateVoting(@Param('id') id: string) {
    return await this.activateVotingUseCase.execute({ votingId: id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteVoting(@Param('id') id: string) {
    return await this.deleteVotingUseCase.execute({ votingId: id });
  }
}
