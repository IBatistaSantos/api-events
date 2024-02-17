import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScheduleDTO {
  @IsUUID('4', {
    message: 'O id da sessão deve ser um UUID válido',
  })
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  sessionId: string;

  @IsUUID('4', {
    message: 'O id da sessão deve ser um UUID válido',
  })
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  eventId: string;

  @IsString({
    message: 'O título deve ser uma string válida',
  })
  @ApiProperty({
    type: 'string',
    example: 'Título do item da agenda',
  })
  title: string;

  @IsString({
    message: 'A descrição deve ser uma string válida',
  })
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Descrição do item da agenda',
  })
  description?: string;

  @IsEnum(['schedule', 'warning', 'break'], {
    message: 'O tipo deve ser um dos valores: schedule, warning, break',
  })
  @ApiProperty({
    type: 'string',
    enum: ['schedule', 'warning', 'break'],
    example: 'schedule',
  })
  @IsOptional()
  type?: string;

  @IsString({
    message: 'A hora de início deve ser uma string válida',
  })
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: '09:00',
  })
  hourStart?: string;

  @IsString({
    message: 'A hora de fim deve ser uma string válida',
  })
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: '09:00',
  })
  hourEnd?: string;
}
