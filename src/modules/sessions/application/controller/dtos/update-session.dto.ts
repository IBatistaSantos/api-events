import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSessionDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The session date.',
    example: '2021-10-10',
  })
  date: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The session hour start.',
    example: '09:50',
  })
  hourStart: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The session hour end.',
    example: '10:00',
  })
  hourEnd: string;
}
