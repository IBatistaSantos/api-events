import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { sortSessions } from '../../main/utils/sort-session';

export interface DetailsEventOutput {
  accountId: string;
  name: string;
  organizationId: string;
  url: string;
  id: string;
  createdAt: string;
  private: boolean;
  inscriptionType: string;
  status: string;
  sessions: {
    date: string;
    hourEnd: string;
    hourStart: string;
    isCurrent: boolean;
    id: string;
  }[];
  type: string;
  updatedAt: string;
}

@Injectable()
export class DetailsEventUseCase {
  constructor(
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(eventId: string): Promise<DetailsEventOutput> {
    const response = await this.eventRepository.findById(eventId);
    if (!response) {
      throw new NotFoundException('Evento nao encontrado');
    }

    const { event, sessions } = response;

    return {
      ...event.toDTO(),
      sessions: sortSessions(sessions),
    };
  }
}
