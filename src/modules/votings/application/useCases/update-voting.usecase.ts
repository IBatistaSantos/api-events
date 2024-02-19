import { NotFoundException } from '@/shared/domain/errors/errors';
import { QuestionType } from '../../domain/question';
import { TargetAudience } from '../../domain/voting';
import { VotingRepository } from '../repository/voting-repository';
import { Inject, Injectable } from '@nestjs/common';

interface QuestionInput {
  title: string;
  type: QuestionType;
  options: string[];
}

interface Input {
  votingId: string;
  params: {
    targetAudience?: TargetAudience;
    timeInSeconds?: number;
    questions?: QuestionInput[];
  };
}

@Injectable()
export class UpdateVotingUseCase {
  constructor(
    @Inject('VotingRepository')
    private repository: VotingRepository,
  ) {}

  async execute(data: Input) {
    const { votingId, params } = data;

    const voting = await this.repository.findById(votingId);
    if (!voting) {
      throw new NotFoundException('Votacao nao encontrada');
    }

    voting.update(params);

    await this.repository.update(voting);

    return voting.toJSON();
  }
}
