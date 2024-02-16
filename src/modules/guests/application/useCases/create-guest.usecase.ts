import { Inject, Injectable } from '@nestjs/common';

import { Guest } from '@/modules/guests/domain/guest';
import { GuestRepository } from '../repository/guest.repository';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface Input {
  email: string;
  eventId: string;
  name: string;
  approvedBy: string;
}

@Injectable()
export class CreateGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { approvedBy, email, eventId, name } = params;
    const existingGuest = await this.guestRepository.findByEmail(
      email,
      eventId,
    );
    if (existingGuest) {
      throw new BadException('O email já foi convidado para o evento');
    }

    const event = await this.guestRepository.findEvent(eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (!event.private) {
      throw new BadException('O evento não é privado');
    }

    const manager = await this.guestRepository.findApprovedGuest(approvedBy);
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

    const guest = new Guest({
      email,
      eventId,
      name,
    });

    guest.approved(approvedBy);

    await this.guestRepository.save(guest);
    return guest.toJSON();
  }
}
