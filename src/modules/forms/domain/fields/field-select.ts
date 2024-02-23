import { FieldSelectable, FieldSelectableProps } from '../field-selectable';

export class FieldSelect extends FieldSelectable {
  constructor(props: FieldSelectableProps) {
    super({ ...props, type: 'select', options: props.options });
  }
}
