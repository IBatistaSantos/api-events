import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { LiveChatDTO } from './live-chat.dto';
import { LiveTranslationDTO } from './live-translation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLiveDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  sessionId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'https://www.youtube.com/watch?v=123456',
    required: true,
  })
  link: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'YOUTUBE',
    enum: ['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'],
    required: true,
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
    isArray: true,
    required: false,
  })
  translation?: LiveTranslationDTO[];
}
