import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSponsorBannerDto {
  @IsNotEmpty({ message: 'O campo url é obrigatório' })
  @ApiProperty({
    description: 'Url do banner',
    type: String,
    example: 'https://www.google.com',
    required: true,
  })
  url: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo desktop é obrigatório' })
  @ApiProperty({
    description: 'Imagem para desktop',
    type: String,
    example: 'desktop-image.jpg',
    required: false,
  })
  desktop?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo mobile é obrigatório' })
  @ApiProperty({
    description: 'Imagem para mobile',
    type: String,
    example: 'mobile-image.jpg',
    required: false,
  })
  mobile?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo tablet é obrigatório' })
  @ApiProperty({
    description: 'Imagem para tablet',
    type: String,
    example: 'tablet-image.jpg',
    required: false,
  })
  tablet?: string;
}
