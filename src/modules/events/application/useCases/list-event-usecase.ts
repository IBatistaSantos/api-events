import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  userId: string;
  accountId: string;
  organizationId?: string;
}

@Injectable()
export class ListEventUseCase {
  constructor(
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(params: Input) {
    const { userId, organizationId, accountId } = params;
    const manager = await this.eventRepository.findManagerById(userId);
    if (!manager) {
      throw new BadException('Manager not found');
    }

    const isMaster = manager.isMaster();
    if (!isMaster && !organizationId) {
      throw new BadException('OrganizationId is required');
    }

    const organizationIds = manager.organizations.map((org) => org.id);

    if (!isMaster && !organizationIds.includes(organizationId)) {
      throw new BadException('Manager is not part of this organization');
    }

    const account = await this.eventRepository.findAccountById(accountId);
    if (!account) {
      throw new BadException('Account not found');
    }

    const isSameAccount = account.id === manager.accountId;
    if (!isSameAccount) {
      throw new BadException('Account is not the same as manager');
    }

    const events = await this.eventRepository.list(accountId, organizationId);

    return events.map((event) => {
      return {
        ...event,
        sessions: this.sortSessions(event.sessions),
      };
    });
  }

  private sortSessions(sessions: any[]) {
    return sessions.sort((a, b) => {
      if (a.isCurrent === b.isCurrent) {
        return Number(new Date(b.date)) - Number(new Date(a.date));
      }
      return a.isCurrent ? -1 : 1;
    });
  }
}
