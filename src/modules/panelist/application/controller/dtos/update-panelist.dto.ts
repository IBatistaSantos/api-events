import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePanelistDTO {
  @IsNotEmpty({
    message: 'O nome do painelista é obrigatório',
  })
  @IsOptional()
  @ApiProperty({
    example: 'John Doe',
    description: 'O nome do painelista',
    required: true,
  })
  name: string;

  @IsOptional()
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

  @IsBoolean({
    message: 'O painelista principal deve ser um booleano',
  })
  @IsOptional()
  @ApiProperty({
    example: 'true',
    description: 'O painelista é principal',
    required: false,
  })
  isPrincipal?: boolean;

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
