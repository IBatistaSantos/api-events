import { User } from '@/modules/users/domain/user';
import { faker } from '@faker-js/faker';

describe('User', () => {
  it('Deve criar um usuário', () => {
    const email = faker.internet.email();
    const name = faker.person.fullName();
    const password = faker.internet.password({ length: 8 });
    const accountId = faker.string.uuid();
    const user = new User({
      accountId,
      email,
      name,
      password,
      type: 'MASTER',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.password).toBe(password);
    expect(user.accountId).toBe(accountId);
    expect(user.status).toBe('ACTIVE');
    expect(user.type).toBe('MASTER');
  });

  it('Deve ser possivel mudar o nome do usuário', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });
    const newName = faker.person.fullName();
    user.changeName(newName);
    expect(user.name).toBe(newName);
  });

  it('Deve retornar o JSON com os dados do usuario', () => {
    const email = faker.internet.email();
    const name = faker.person.fullName();
    const password = faker.internet.password({ length: 8 });
    const accountId = faker.string.uuid();
    const user = new User({
      accountId,
      email,
      name,
      password,
      type: 'MASTER',
    });

    expect(user.toJSON()).toEqual({
      id: user.id,
      name,
      email,
      accountId,
      status: 'ACTIVE',
      type: 'MASTER',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('Deve ser possivel mudar a senha do usuário', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });
    const newPassword = faker.internet.password({ length: 8 });
    user.changePassword(newPassword);
    expect(user.password).toBe(newPassword);
  });

  it('Deve ser possivel reativar o usuário', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      status: 'INACTIVE',
      type: 'MASTER',
    });

    user.activate();
    expect(user.status).toBe('ACTIVE');
  });

  it('Deve ser possivel mudar o email do usuario', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });
    const newEmail = faker.internet.email();
    user.changeEmail(newEmail);
    expect(user.email).toBe(newEmail);
  });

  it('Deve retornar se o usuario esta ativo', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });

    expect(user.isActive()).toBe(true);

    user.deactivate();

    expect(user.isActive()).toBe(false);
  });

  it('Deve ser possivel mudar o status do usuário', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });

    user.deactivate();
    expect(user.status).toBe('INACTIVE');
  });

  it('Deve ser possivel mudar o tipo do usuário', () => {
    const user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 8 }),
      type: 'MASTER',
    });

    user.changeType('ADMIN');
    expect(user.type).toBe('ADMIN');
  });

  it('Deve falhar ao criar um usuário com email inválido', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: 'invalid',
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 8 }),
        type: 'MASTER',
      });
    }).toThrow('Invalid email');
  });

  it('Deve falhar ao criar um usuário com tipo inválido', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 8 }),
        type: 'INVALID',
      });
    }).toThrow('Invalid type');
  });

  it('Deve falhar ao criar um usuario com somente o primeiro nome', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password({ length: 8 }),
        type: 'MASTER',
      });
    }).toThrow('Name must have first and last name');
  });

  it('Deve falhar ao criar um usuario sem nome', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: '',
        password: faker.internet.password({ length: 8 }),
        type: 'MASTER',
      });
    }).toThrow('Name is required');
  });

  it('Deve falhar ao criar um usuario sem email', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: '',
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 8 }),
        type: 'MASTER',
      });
    }).toThrow('Email is required');
  });

  it('Deve falhar ao criar um usuario sem senha', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: '',
        type: 'MASTER',
      });
    }).toThrow('Password is required');
  });

  it('Deve falhar ao criar um usuario sem tipo', () => {
    expect(() => {
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 8 }),
        type: '',
      });
    }).toThrow('Type is required');
  });

  it('Deve falhar ao criar um usuario sem id da conta', () => {
    expect(() => {
      new User({
        accountId: '',
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 8 }),
        type: 'MASTER',
      });
    }).toThrow('Account id is required');
  });
});
