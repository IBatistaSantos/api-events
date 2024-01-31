import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateEventDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Event name',
    example: 'Event name',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Event url',
    example: 'summitEvent',
  })
  url: string;

  @IsOptional()
  @IsEnum(['DIGITAL', 'PRESENCIAL', 'HIBRIDO'])
  @ApiProperty({
    description: 'Event type',
    example: 'DIGITAL',
    enum: ['DIGITAL', 'PRESENCIAL', 'HIBRIDO'],
  })
  type: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'List of dates',
    example: ['2021-10-10'],
  })
  date: string[];

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Organization id',
    example: 'uuid',
  })
  organizationId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Hour start',
    example: '10:00',
  })
  hourStart: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Hour end',
    example: '12:00',
  })
  hourEnd: string;
}
