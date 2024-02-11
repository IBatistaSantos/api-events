import { UserType } from '@/modules/users/domain/value-object/user-type';
import { BadException } from '@/shared/domain/errors/errors';

describe('UserType', () => {
  it('Deve retornar a instancia de UserType', () => {
    const userType = new UserType('ADMIN');
    expect(userType).toBeInstanceOf(UserType);
    expect(userType.value).toBe('ADMIN');
  });

  it('Deve retornar um erro quando o tipo for invalido', () => {
    expect(() => new UserType('INVALID')).toThrow(
      new BadException('Invalid type'),
    );
  });

  it('Deve retornar true quando o tipo for ADMIN', () => {
    const userType = new UserType('ADMIN');
    expect(userType.isAdmin()).toBeTruthy();
  });

  it('Deve retornar true quando o tipo for MASTER', () => {
    const userType = new UserType('MASTER');
    expect(userType.isMaster()).toBeTruthy();
  });

  it('Deve retornar true quando o tipo for MODERATOR', () => {
    const userType = new UserType('MODERATOR');
    expect(userType.isModerator()).toBeTruthy();
  });
});
