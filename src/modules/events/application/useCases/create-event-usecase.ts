import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { CreateEventService } from '../../domain/services/create-event.service';
import { EventRepository } from '../repository/event.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface Input {
  name: string;
  url: string;
  date: string[];
  hourStart: string;
  hourEnd: string;
  userId: string;
  accountId: string;
  organizationId: string;
}

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('EventRepository')
    private eventRepository: EventRepository,
    @Inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  async execute(params: Input) {
    const {
      accountId,
      date,
      hourEnd,
      hourStart,
      name,
      organizationId,
      url,
      userId,
    } = params;

    const manager = await this.eventRepository.findManagerById(userId);
    if (!manager) {
      throw new BadRequestException('Manager not found');
    }

    const isPermitted = manager.can(ListPermissions.CREATE_EVENT);
    if (!isPermitted) {
      throw new BadRequestException('Manager not permitted');
    }

    const organization =
      await this.eventRepository.findOrganizationById(organizationId);
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const isSameAccount = organization.accountId === accountId;
    if (!isSameAccount) {
      throw new BadRequestException(
        'You are not allowed to create an event for this account',
      );
    }

    const account = await this.eventRepository.findAccountById(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const quantityEvents =
      await this.eventRepository.countEventsByAccountId(accountId);

    account.validateMaxEvent(quantityEvents);
    const eventExists = await this.eventRepository.findByURL(url);
    if (eventExists) {
      throw new BadRequestException('Event already exists');
    }

    const createEventService = new CreateEventService(this.dateProvider);
    const { event, sessions } = createEventService.execute({
      date,
      hourStart,
      hourEnd,
      url,
      name,
      accountId,
      organizationId,
    });

    await this.eventRepository.save(event);
    await this.eventRepository.saveSessions(sessions);

    return {
      id: event.id,
      name: event.name,
      url: event.url,
      inscriptionType: event.inscriptionType,
      organizationId: event.organizationId,
      accountId: event.accountId,
      private: event.private,
      featureFlags: event.featureFlags,
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
