import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { OptionDTO } from './option.dto';

export class FieldDTO {
  @IsNotEmpty({ message: 'A label do campo é obrigatório' })
  label: string;

  @IsNotEmpty({ message: 'O tipo do campo é obrigatório' })
  type: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo obrigatório deve ser um booleano' })
  required: boolean;

  @IsNotEmpty({ message: 'O placeholder do campo é obrigatório' })
  placeholder: string;

  @IsOptional()
  @ArrayNotEmpty({ message: 'É necessário pelo menos uma opção' })
  options?: OptionDTO[];
}
