import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSponsorBannerDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O campo url é obrigatório' })
  url: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo desktop é obrigatório' })
  desktop?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo mobile é obrigatório' })
  mobile?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo tablet é obrigatório' })
  tablet?: string;
}
