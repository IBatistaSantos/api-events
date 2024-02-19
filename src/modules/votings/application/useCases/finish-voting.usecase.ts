import { Inject, Injectable } from '@nestjs/common';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { VotingRepository } from '../repository/voting-repository';

interface Input {
  votingId: string;
}

@Injectable()
export class FinishVotingUseCase {
  constructor(
    @Inject('VotingRepository')
    private repository: VotingRepository,
  ) {}

  async execute(params: Input) {
    const { votingId } = params;

    const voting = await this.repository.findById(votingId);
    if (!voting) {
      throw new NotFoundException('Votacao nao encontrada');
    }

    if (!voting.activated) {
      throw new BadException('Votacao nao iniciada');
    }

    voting.deactivate();

    await this.repository.update(voting);
  }
}
