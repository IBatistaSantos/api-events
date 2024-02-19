import { Inject, Injectable } from '@nestjs/common';
import { TargetAudience, Voting } from '../../domain/voting';
import { QuestionType } from '../../domain/question';
import { VotingRepository } from '../repository/voting-repository';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';

interface QuestionInput {
  title: string;
  type: QuestionType;
  options: string[];
}

interface Input {
  liveId: string;
  targetAudience?: TargetAudience;
  timeInSeconds?: number;
  questions: QuestionInput[];
}

@Injectable()
export class CreateVotingUseCase {
  constructor(
    @Inject('VotingRepository')
    private repository: VotingRepository,
  ) {}

  async execute(params: Input) {
    const { liveId, questions, targetAudience, timeInSeconds } = params;

    const live = await this.repository.findLive(liveId);
    if (!live) {
      throw new NotFoundException('Live nao encontrada');
    }

    if (live.finished) {
      throw new BadException('Live encerrada');
    }

    const newVoting = new Voting({
      targetAudience,
      questions,
      liveId,
      timeInSeconds,
    });

    await this.repository.save(newVoting);

    return newVoting.toJSON();
  }
}
