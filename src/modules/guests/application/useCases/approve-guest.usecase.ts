import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../repository/guest.repository';

interface Input {
  guestId: string;
  approvedBy: string;
}

@Injectable()
export class ApproveGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(params: Input) {
    const { guestId, approvedBy } = params;
    const guest = await this.guestRepository.findById(guestId);

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    guest.approved(approvedBy);

    await this.guestRepository.save(guest);

    return guest.toJSON();
  }
}
