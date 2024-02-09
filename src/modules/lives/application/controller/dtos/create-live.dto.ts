import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { LiveChatDTO } from './live-chat.dto';
import { LiveTranslationDTO } from './live-translation.dto';

export class CreateLiveDTO {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
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
