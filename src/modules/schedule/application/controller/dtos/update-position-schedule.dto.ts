import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class UpdatePositionScheduleDTO {
  @ArrayNotEmpty()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
  })
  @IsUUID('4', {
    each: true,
    message: 'O id dos itens da agenda devem ser um UUID válido',
  })
  scheduleIds: string[];

  @IsUUID('4', {
    message: 'O id do evento deve ser um UUID válido',
  })
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  eventId: string;
}
