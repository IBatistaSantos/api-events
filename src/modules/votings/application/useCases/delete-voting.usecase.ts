import { Inject, Injectable } from '@nestjs/common';
import { VotingRepository } from '../repository/voting-repository';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';

interface Input {
  votingId: string;
}

@Injectable()
export class DeleteVotingUseCase {
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

    if (voting.activated) {
      throw new BadException('Votacao ja iniciada');
    }

    voting.delete();

    await this.repository.update(voting);
  }
}
