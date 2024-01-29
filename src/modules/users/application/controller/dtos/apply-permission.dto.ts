import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class ApplyPermissionDTO {
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'Permissions to be applied',
    example: ['uuid', 'uuid'],
  })
  permissions: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'User id to apply permissions',
    example: 'uuid',
  })
  userId: string;
}
