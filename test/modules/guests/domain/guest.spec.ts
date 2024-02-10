import { Guest } from '@/modules/guests/domain/guest';
import { faker } from '@faker-js/faker';

describe('Guest', () => {
  it('Deve criar um covidado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    expect(guest.id).toBeDefined();
    expect(guest.email).toBeDefined();
    expect(guest.eventId).toBeDefined();
    expect(guest.name).toBeDefined();
    expect(guest.isConfirmed).toBeFalsy();
    expect(guest.statusGuest).toBe('waiting_approved');

    expect(guest.status).toBe('ACTIVE');
    expect(guest.toJSON()).toEqual({
      email: guest.email,
      eventId: guest.eventId,
      id: guest.id,
      isConfirmed: false,
      name: guest.name,
      status: 'ACTIVE',
      statusGuest: 'waiting_approved',
      approvedAt: null,
      approvedBy: null,
      recusedAt: null,
      recusedBy: null,
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    });
  });

  it('Deve aprovar um convidado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.approved('user');

    expect(guest.approvedBy).toBe('user');
    expect(guest.approvedAt).toBeDefined();
    expect(guest.statusGuest).toBe('approved');
    expect(guest.status).toBe('ACTIVE');
  });

  it('Deve recusar um convidado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.refuse('user');

    expect(guest.isConfirmed).toBeFalsy();
    expect(guest.statusGuest).toBe('refused');
    expect(guest.recusedAt).toBeDefined();
    expect(guest.recusedBy).toBe('user');
  });

  it('Deve confirmar um convidado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.approved('user');
    guest.confirm();

    expect(guest.statusGuest).toBe('confirmed');
  });

  it('Não deve aprovar um convidado já recusado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.refuse('user');

    expect(() => guest.approved('user')).toThrow('Guest refused');
  });

  it('Não deve recusar um convidado já recusado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.refuse('user');

    expect(() => guest.refuse('user')).toThrow('Guest already refused');
  });

  it('Não deve recusar um convidado já confirmado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.approved('user');
    guest.confirm();

    expect(() => guest.refuse('user')).toThrow('Guest already confirmed');
  });

  it('Não deve confirmar um convidado que foi recusado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    guest.refuse('user');

    expect(() => guest.confirm()).toThrow('Guest refused');
  });

  it('Não deve confirmar um convidado que ainda nao foi aprovado', () => {
    const guest = new Guest({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
    });

    expect(() => guest.confirm()).toThrow('Guest not approved');
  });

  describe('validate', () => {
    it('Deve lançar uma exceção se o nome não for informado', () => {
      expect(() => new Guest({} as any)).toThrow('Name is required');
    });

    it('Deve lançar uma exceção se o email não for informado', () => {
      expect(() => new Guest({ name: faker.person.fullName() } as any)).toThrow(
        'Email is required',
      );
    });

    it('Deve lançar uma exceção se o evento não for informado', () => {
      expect(
        () =>
          new Guest({
            name: faker.person.fullName(),
            email: faker.internet.email(),
          } as any),
      ).toThrow('EventId is required');
    });
  });
});
