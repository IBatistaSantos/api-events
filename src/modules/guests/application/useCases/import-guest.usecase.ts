import { Inject, Injectable } from '@nestjs/common';

import { Guest } from '@/modules/guests/domain/guest';
import { GuestRepository } from '../repository/guest.repository';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface InputData {
  name: string;
  email: string;
}

interface Input {
  guests: InputData[];
  eventId: string;
  approvedBy: string;
}

export interface ImportGuestError {
  email: string;
  name: string;
  error: string;
}

export interface ImportGuestSuccess {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class ImportGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { approvedBy, eventId, guests } = params;

    const errors: ImportGuestError[] = [];
    const success: ImportGuestSuccess[] = [];

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

    const emails = guests.map((guest) => guest.email);
    const existingGuests = await this.guestRepository.findByEmails(
      emails,
      eventId,
    );

    for (const guest of guests) {
      const { email, name } = guest;
      try {
        const existingGuest = existingGuests.find((g) => g.email === email);
        if (existingGuest) {
          throw new BadException('Guest already exists');
        }

        const guest = new Guest({
          email,
          eventId,
          name,
        });

        guest.approved(approvedBy);

        await this.guestRepository.save(guest);
        success.push({
          id: guest.id,
          name: guest.name,
          email: guest.email,
        });
      } catch (error) {
        errors.push({ email, name, error: error.message });
      }
    }

    return { success, errors };
  }
}
