import { Panelist } from '@/modules/panelist/domain/panelist';
import { faker } from '@faker-js/faker';

describe('Panelist', () => {
  it('Deve criar um painelista', () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      eventId: faker.string.uuid(),
    };
    const panelist = new Panelist(params);

    expect(panelist).toBeInstanceOf(Panelist);
    expect(panelist.id).toBeDefined();
    expect(panelist.name).toBe(params.name);
    expect(panelist.email).toBe(params.email);
    expect(panelist.office).toBe(params.office);
    expect(panelist.createdAt).toBeDefined();
  });

  it('Deve criar um painelista com descrição', () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      description: faker.lorem.sentence(),
      eventId: faker.string.uuid(),
    };
    const panelist = new Panelist(params);

    expect(panelist).toBeInstanceOf(Panelist);
    expect(panelist.id).toBeDefined();
    expect(panelist.name).toBe(params.name);
    expect(panelist.email).toBe(params.email);
    expect(panelist.office).toBe(params.office);
    expect(panelist.description).toBe(params.description);
    expect(panelist.createdAt).toBeDefined();
  });

  describe('validate', () => {
    it('Deve lançar um erro se o nome for vazio', () => {
      const params = {
        name: '',
        email: faker.internet.email(),
        office: faker.company.name(),
        eventId: faker.string.uuid(),
      };

      expect(() => new Panelist(params)).toThrow(
        'O nome do painelista é obrigatório',
      );
    });

    it('Deve lançar um erro se o email for vazio', () => {
      const params = {
        name: faker.person.fullName(),
        email: '',
        office: faker.company.name(),
        eventId: faker.string.uuid(),
      };

      expect(() => new Panelist(params)).toThrow(
        'O email do painelista é obrigatório',
      );
    });

    it('Deve lançar um erro se o cargo for vazio', () => {
      const params = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        office: '',
      };

      expect(() => new Panelist(params)).toThrowError(
        'O cargo do painelista é obrigatório',
      );
    });

    it('Deve lançar um erro se o ID do evento for vazio', () => {
      const params = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        office: faker.company.name(),
        eventId: '',
      };

      expect(() => new Panelist(params)).toThrow(
        'O evento do painelista é obrigatório',
      );
    });
  });
});
