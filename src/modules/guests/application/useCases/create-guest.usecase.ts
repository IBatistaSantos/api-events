import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { Guest } from '@/modules/guests/domain/guest';
import { GuestRepository } from '../repository/guest.repository';

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
    const existingGuest = await this.guestRepository.findByEmail(email);
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
    return guest.toJSON();
  }
}
