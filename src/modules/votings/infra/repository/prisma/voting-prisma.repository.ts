import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

import { Live } from '@/modules/lives/domain/live';
import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { QuestionType } from '@/modules/votings/domain/question';
import { TargetAudience, Voting } from '@/modules/votings/domain/voting';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';

@Injectable()
export class VotingPrismaRepository implements VotingRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByLiveId(liveId: string): Promise<Voting[]> {
    const votings = await this.prisma.voting.findMany({
      where: {
        liveId,
        status: 'ACTIVE',
      },
      include: {
        Question: true,
      },
    });

    if (!votings || !votings.length) return [];

    return votings.map(
      (voting) =>
        new Voting({
          questions: voting.Question.map((question) => ({
            title: question.title,
            type: question.type as QuestionType,
            id: question.id,
            options: question.options,
          })),
          activated: voting.activated,
          createdAt: voting.createdAt,
          endDate: voting.endDate,
          id: voting.id,
          liveId: voting.liveId,
          startDate: voting.startDate,
          status: voting.status,
          targetAudience: voting.targetAudience as TargetAudience,
          timeInSeconds: voting.timeInSeconds,
          updatedAt: voting.updatedAt,
        }),
    );
  }

  async findById(votingId: string): Promise<Voting> {
    const voting = await this.prisma.voting.findUnique({
      where: {
        id: votingId,
        status: 'ACTIVE',
      },
      include: {
        Question: true,
      },
    });

    if (!voting) return null;

    return new Voting({
      questions: voting.Question.map((question) => ({
        title: question.title,
        type: question.type as QuestionType,
        id: question.id,
        options: question.options,
      })),
      activated: voting.activated,
      createdAt: voting.createdAt,
      endDate: voting.endDate,
      id: voting.id,
      liveId: voting.liveId,
      startDate: voting.startDate,
      status: voting.status,
      targetAudience: voting.targetAudience as TargetAudience,
      timeInSeconds: voting.timeInSeconds,
      updatedAt: voting.updatedAt,
    });
  }

  async findLive(liveId: string): Promise<Live> {
    const response = await this.prisma.live.findUnique({
      where: {
        id: liveId,
        status: 'ACTIVE',
      },
    });

    if (!response) return null;

    return new Live({
      id: response.id,
      title: response.title,
      status: response.status,
      eventId: response.eventId,
      link: response.link,
      sessionId: response.sessionId,
      typeLink: response.typeLink,
      disableChat: response.disableChat,
      disableReactions: response.disableReactions,
      enableTranslate: response.enableTranslate,
      isMain: response.isMain,
      finishedAt: response.finishedAt,
      finished: response.finished,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  }

  async save(voting: Voting): Promise<void> {
    await this.prisma.voting.create({
      data: {
        id: voting.id,
        liveId: voting.liveId,
        startDate: voting.startDate,
        endDate: voting.endDate,
        timeInSeconds: voting.timeInSeconds,
        activated: voting.activated,
        status: voting.status as UserStatus,
        targetAudience: voting.targetAudience,
        createdAt: voting.createdAt,
        updatedAt: voting.updatedAt,
        Question: {
          create: voting.questions.map((question) => ({
            title: question.title,
            type: question.type,
            options: question.options,
          })),
        },
      },
    });
  }

  async update(voting: Voting): Promise<void> {
    await this.prisma.voting.update({
      where: {
        id: voting.id,
      },
      data: {
        liveId: voting.liveId,
        startDate: voting.startDate,
        endDate: voting.endDate,
        timeInSeconds: voting.timeInSeconds,
        activated: voting.activated,
        status: voting.status as UserStatus,
        targetAudience: voting.targetAudience,
        updatedAt: voting.updatedAt,
        Question: {
          deleteMany: {},
          create: voting.questions.map((question) => ({
            title: question.title,
            type: question.type,
            options: question.options,
          })),
        },
      },
    });
  }
}
