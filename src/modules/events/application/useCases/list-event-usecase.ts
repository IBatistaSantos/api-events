import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import { Events } from '../../domain/events';

interface Input {
  userId: string;
  accountId: string;
  organizationId?: string;
}

@Injectable()
export class ListEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(params: Input): Promise<Events[]> {
    const { userId, organizationId, accountId } = params;
    const manager = await this.eventRepository.findManagerById(userId);
    if (!manager) {
      throw new BadRequestException('Manager not found');
    }

    const isMaster = manager.isMaster();
    if (!isMaster && !organizationId) {
      throw new BadRequestException('OrganizationId is required');
    }

    const organizationIds = manager.organizations.map((org) => org.id);

    if (!isMaster && !organizationIds.includes(organizationId)) {
      throw new BadRequestException('Manager is not part of this organization');
    }

    const account = await this.eventRepository.findAccountById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const isSameAccount = account.id === manager.accountId;
    if (!isSameAccount) {
      throw new BadRequestException('Account is not the same as manager');
    }

    const events = await this.eventRepository.list(accountId, organizationId);
    return events;
  }
}
