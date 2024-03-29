import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePanelistDTO {
  @IsString({
    message: 'O nome do painelista deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome do painelista é obrigatório',
  })
  @ApiProperty({
    example: 'John Doe',
    description: 'O nome do painelista',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: 'O email do painelista é obrigatório',
  })
  @IsEmail({}, { message: 'O email do painelista deve ser um email válido' })
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'O email do painelista',
    required: true,
  })
  email: string;

  @IsNotEmpty({
    message: 'O ID do evento do painelista é obrigatório',
  })
  @IsUUID(undefined, {
    message: 'O ID do evento do painelista deve ser um UUID válido',
  })
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'O ID do evento do painelista',
    required: true,
  })
  eventId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Developer',
    description: 'O cargo do painelista',
    required: true,
  })
  office: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The description of the panelist',
    description: 'A descrição/curriculo do painelista',
    required: false,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The photo of the panelist',
    description: 'A foto do painelista',
    required: false,
  })
  photo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The section name of the panelist',
    description: 'O nome da seção do painelista',
    required: false,
  })
  sectionName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The color of the panelist',
    description: 'A cor da seção do painelista',
    required: false,
  })
  colorPrincipal?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'true',
    description: 'Aumentar o tamanho do painelista',
    required: false,
  })
  increaseSize?: boolean;
}
