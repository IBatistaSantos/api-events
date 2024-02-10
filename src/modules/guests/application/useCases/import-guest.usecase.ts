import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { Guest } from '@/modules/guests/domain/guest';
import { GuestRepository } from '../repository/guest.repository';

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
          throw new BadRequestException('Guest already exists');
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
