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
import { CreateVotingUseCase } from '../useCases/create-voting.usecase';
import { UpdateVotingUseCase } from '../useCases/update-voting.usecase';
import { DeleteVotingUseCase } from '../useCases/delete-voting.usecase';
import { ListVotingUseCase } from '../useCases/list-voting.usecase';
import { FinishVotingUseCase } from '../useCases/finish-voting.usecase';
import { ActivateVotingUseCase } from '../useCases/actived-voting.usecase';
import { AuthGuard } from '@nestjs/passport';

@Controller(`${baseRoute.base_url_v1}/votings`)
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
  async listVotings(@Param('liveId') liveId: string) {
    return await this.listVotingsUseCase.execute({
      liveId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createVoting(@Body() voting: any) {
    return await this.createVotingUseCase.execute(voting);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateVoting(@Body() voting: any, @Param('id') id: string) {
    return await this.updateVotingUseCase.execute({
      votingId: id,
      params: voting,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/finish')
  async finishVoting(@Param('id') id: string) {
    return await this.finishVotingUseCase.execute({ votingId: id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/activate')
  async activateVoting(@Param('id') id: string) {
    return await this.activateVotingUseCase.execute({ votingId: id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteVoting(@Param('id') id: string) {
    return await this.deleteVotingUseCase.execute({ votingId: id });
  }
}
