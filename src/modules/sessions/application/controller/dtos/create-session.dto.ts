import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'ID Event',
    required: true,
  })
  eventId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '2021-10-10',
    description: 'Date',
    required: true,
  })
  date: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '10:00',
    required: true,
    description: 'Hour Start',
  })
  hourStart: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '11:00',
    required: false,
    description: 'Hour End',
  })
  hourEnd: string;
}
