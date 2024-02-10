import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class LiveChatDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'Title of the live',
    required: false,
  })
  title?: string;

  @IsNotEmpty()
  @IsEnum(['open', 'moderate'])
  @ApiProperty({
    type: 'string',
    example: 'open',
    enum: ['open', 'moderate'],
    required: false,
    default: 'open',
  })
  type?: string;
}
