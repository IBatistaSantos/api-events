import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FinishSessionDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'ID Session',
    required: false,
  })
  hourEnd: string;
}
