import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VotingRepository } from '../repository/voting-repository';

interface Input {
  liveId: string;
}

@Injectable()
export class ListVotingUseCase {
  constructor(
    @Inject('VotingRepository')
    private repository: VotingRepository,
  ) {}

  async execute(params: Input) {
    const { liveId } = params;

    const live = await this.repository.findLive(liveId);
    if (!live) {
      throw new NotFoundException('Live nao encontrada');
    }

    const voting = await this.repository.findByLiveId(liveId);

    return voting.map((voting) => voting.toJSON());
  }
}
