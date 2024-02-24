import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { FieldDTO } from './field.dto';

export class UpdateFormDTO {
  @IsOptional()
  @IsNotEmpty({ message: 'Titulo é obrigatório' })
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @ArrayNotEmpty({ message: 'É necessário pelo menos um campo' })
  fields: FieldDTO[];
}
