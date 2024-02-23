import { BadException } from '@/shared/domain/errors/errors';

import { Field, FieldProps } from './field';

import { FieldNumber } from './fields/field-number';
import { FieldSelect } from './fields/field-select';
import { FieldText } from './fields/field-text';
import { FieldPassword } from './fields/field-password';
import { FieldCheckbox } from './fields/field-checkbok';

export class FieldFactory {
  static create(field: FieldProps): Field {
    switch (field.type) {
      case 'text':
        return new FieldText(field);
      case 'select':
        return new FieldSelect(field);
      case 'checkbox':
        return new FieldCheckbox(field);
      case 'number':
        return new FieldNumber(field);
      case 'password':
        return new FieldPassword(field);
      default:
        throw new BadException('Invalid field type');
    }
  }
}
