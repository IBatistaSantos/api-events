import { Inject, Injectable } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';
import { NotFoundException } from '@/shared/domain/errors/errors';

interface InputData {
  link: string;
  typeLink: string;
  title: string;
  disableChat: boolean;
  disableReactions: boolean;
  isMain: boolean;
  chat: any;
  translation: any;
}

interface Input {
  liveId: string;
  data: Partial<InputData>;
}

@Injectable()
export class UpdateLiveUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly repository: LiveRepository,
  ) {}

  async execute(params: Input) {
    const { liveId, data } = params;

    const live = await this.repository.findById(liveId);
    if (!live) {
      throw new NotFoundException('Live not found');
    }

    const session = await this.repository.findSessionById(live.sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.finished) {
      throw new NotFoundException('Session already finished');
    }

    if (live.finished) {
      throw new NotFoundException('Live already finished');
    }

    const { link, typeLink, title, chat, isMain, translation } = data;

    live.update({
      chat,
      isMain,
      title,
      typeLink,
      link,
      translation,
    });

    await this.repository.update(live);

    return live.toJSON();
  }
}
