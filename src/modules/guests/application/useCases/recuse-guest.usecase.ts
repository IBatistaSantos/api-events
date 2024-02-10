import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../repository/guest.repository';

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
      throw new NotFoundException('Guest not found');
    }

    guest.refuse(recusedBy);

    await this.guestRepository.save(guest);

    return guest.toJSON();
  }
}
