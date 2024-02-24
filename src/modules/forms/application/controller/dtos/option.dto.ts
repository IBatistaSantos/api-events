import { IsNotEmpty, IsOptional } from 'class-validator';
import { FieldDTO } from './field.dto';

export class OptionDTO {
  @IsNotEmpty({ message: 'O valor da opção é obrigatório' })
  value: string;

  @IsNotEmpty({ message: 'O label da opção é obrigatório' })
  label: string;

  @IsOptional()
  additionalFields: FieldDTO[];
}
