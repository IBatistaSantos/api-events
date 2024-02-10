import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LiveTranslationDTO {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'pt',
    required: true,
  })
  language: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'https://www.youtube.com/watch?v=123456',
    required: true,
  })
  link: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Title of the live',
    required: false,
  })
  text: string;
}
