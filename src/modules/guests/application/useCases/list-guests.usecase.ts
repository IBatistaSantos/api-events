import { Inject, Injectable } from '@nestjs/common';

import { GuestRepository } from '../repository/guest.repository';
import { Guest } from '../../domain/guest';

interface Input {
  eventId: string;
}

@Injectable()
export class ListGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { eventId } = params;
    const listGuests = await this.guestRepository.listByEventId(eventId);

    return Guest.sort(listGuests).map((guest) => guest.toJSON());
  }
}
