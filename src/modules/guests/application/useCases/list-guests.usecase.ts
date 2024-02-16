import { Inject, Injectable } from '@nestjs/common';

import { GuestRepository } from '../repository/guest.repository';
import { Guest } from '../../domain/guest';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface Input {
  eventId: string;
  userId: string;
}

@Injectable()
export class ListGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { eventId, userId } = params;

    const event = await this.guestRepository.findEvent(eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const manager = await this.guestRepository.findApprovedGuest(userId);
    if (!manager) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isSameAccount = manager.accountId === event.accountId;
    if (!isSameAccount) {
      throw new BadException(
        'Usuário não tem permissão para aprovar convidados',
      );
    }

    const isCanAction = manager.can(ListPermissions.MANAGER_EVENT);
    if (!isCanAction) {
      throw new BadException(
        'Usuário não tem permissão para aprovar convidados',
      );
    }

    const listGuests = await this.guestRepository.listByEventId(eventId);

    return Guest.sort(listGuests).map((guest) => guest.toJSON());
  }
}
