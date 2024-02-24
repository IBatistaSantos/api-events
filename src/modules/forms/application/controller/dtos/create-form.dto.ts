import { ArrayNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { FieldDTO } from './field.dto';

export class CreateFormDTO {
  @IsNotEmpty({ message: 'Titulo é obrigatório' })
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty({ message: 'O ID da organizacao é obrigatório' })
  organizationId: string;

  @ArrayNotEmpty({ message: 'É necessário pelo menos um campo' })
  fields: FieldDTO[];
}
