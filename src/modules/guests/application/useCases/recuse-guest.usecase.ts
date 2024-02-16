import { Inject, Injectable } from '@nestjs/common';
import { GuestRepository } from '../repository/guest.repository';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface Input {
  guestId: string;
  recusedBy: string;
}

@Injectable()
export class RecuseGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { guestId, recusedBy } = params;
    const guest = await this.guestRepository.findById(guestId);

    if (!guest) {
      throw new NotFoundException('Convidado não encontrado');
    }

    const event = await this.guestRepository.findEvent(guest.eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const manager = await this.guestRepository.findApprovedGuest(recusedBy);
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

    guest.refuse(recusedBy);

    await this.guestRepository.save(guest);

    return guest.toJSON();
  }
}
