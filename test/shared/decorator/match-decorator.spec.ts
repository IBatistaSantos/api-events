import { MatchConstraint } from '@/shared/decorator/match-decorator';
import { ValidationArguments } from 'class-validator';

describe('Match', () => {
  it('Deve validar se os campos coincidem', () => {
    const matchConstraint = new MatchConstraint();
    const value = 'password';
    const relatedPropertyName = 'password';
    const relatedValue = 'password';

    const validationArguments: ValidationArguments = {
      constraints: [relatedPropertyName],
      object: {
        [relatedPropertyName]: relatedValue,
      },
      value: relatedValue,
      targetName: relatedPropertyName,
      property: 'confirmPassword',
    };

    const validationResult = matchConstraint.validate(
      value,
      validationArguments,
    );

    expect(validationResult).toBe(true);
  });

  it('Deve retornar mensagem de erro quando os campos não coincidem', () => {
    const matchConstraint = new MatchConstraint();
    const value = 'password';
    const relatedPropertyName = 'password';
    const relatedValue = 'differentPassword';

    const validationArguments: ValidationArguments = {
      constraints: [relatedPropertyName],
      object: {
        [relatedPropertyName]: relatedValue,
      },
      targetName: relatedPropertyName,
      value: relatedValue,
      property: 'confirmPassword',
    };

    const validationResult = matchConstraint.validate(
      value,
      validationArguments,
    );
    const errorMessage = matchConstraint.defaultMessage(validationArguments);

    expect(validationResult).toBe(false);
    expect(errorMessage).toBe(
      `The field ${relatedPropertyName} and ${validationArguments.property} don't match`,
    );
  });
});
