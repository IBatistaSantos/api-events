import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { LiveChatDTO } from './live-chat.dto';
import { LiveTranslationDTO } from './live-translation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLiveDTO {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'https://www.youtube.com/watch?v=123456',
    required: false,
  })
  link: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'YOUTUBE',
    enum: ['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'],
    required: false,
  })
  typeLink: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: 'boolean',
    example: true,
    required: false,
  })
  isMain?: boolean;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Title of the live',
    required: false,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({
    type: LiveChatDTO,
    required: false,
  })
  chat?: LiveChatDTO;

  @IsOptional()
  @ArrayNotEmpty()
  @ApiProperty({
    type: LiveTranslationDTO,
    required: false,
  })
  translation?: LiveTranslationDTO[];
}
