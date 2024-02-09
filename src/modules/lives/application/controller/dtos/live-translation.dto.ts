import { IsNotEmpty, IsOptional } from 'class-validator';

export class LiveTranslationDTO {
  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  @IsOptional()
  text: string;
}
