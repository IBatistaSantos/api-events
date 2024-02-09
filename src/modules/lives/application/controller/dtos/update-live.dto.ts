import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { LiveChatDTO } from './live-chat.dto';
import { LiveTranslationDTO } from './live-translation.dto';

export class UpdateLiveDTO {
  @IsNotEmpty()
  @IsOptional()
  link: string;

  @IsNotEmpty()
  @IsOptional()
  typeLink: string;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsOptional()
  chat?: LiveChatDTO;

  @IsOptional()
  @ArrayNotEmpty()
  translation?: LiveTranslationDTO[];
}
