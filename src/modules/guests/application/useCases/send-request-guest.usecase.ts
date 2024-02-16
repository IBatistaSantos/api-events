import { Inject, Injectable } from '@nestjs/common';
import { GuestRepository } from '../repository/guest.repository';
import { BadException } from '@/shared/domain/errors/errors';
import { Guest } from '../../domain/guest';

interface Input {
  name: string;
  email: string;
  eventId: string;
}

@Injectable()
export class SendRequestGuestUseCase {
  constructor(
    @Inject('GuestRepository')
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(props: Input) {
    const { name, email, eventId } = props;
    const existing = await this.guestRepository.findByEmail(email, eventId);

    if (existing) {
      throw new BadException('Convidado já cadastrado com este email');
    }

    const event = await this.guestRepository.findEvent(eventId);
    if (!event) {
      throw new BadException('Evento não encontrado');
    }

    if (!event.private) {
      throw new BadException('O evento não é privado');
    }

    const guest = new Guest({
      name,
      email,
      eventId,
    });

    await this.guestRepository.save(guest);

    return guest.toJSON();
  }
}
