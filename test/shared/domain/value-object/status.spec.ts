import { Status } from '@/shared/domain/value-object/status';

describe('UserStatus', () => {
  it('Deve retornar a instancia de UserStatus', () => {
    const userStatus = new Status('ACTIVE');
    expect(userStatus).toBeInstanceOf(Status);
    expect(userStatus.value).toBe('ACTIVE');
  });

  it('Deve retornar um erro quando o status for invalido', () => {
    expect(() => new Status('INVALID')).toThrow(new Error('Invalid status'));
  });

  it('Deve retornar true quando o status for ACTIVE', () => {
    const status = new Status('ACTIVE');
    expect(status.isActive()).toBeTruthy();
  });

  it('Deve retornar false quando o status for INACTIVE', () => {
    const status = new Status('INACTIVE');
    expect(status.isInactive()).toBeTruthy();
  });
});
