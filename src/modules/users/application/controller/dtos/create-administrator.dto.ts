import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdministratorDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the administrator',
    example: 'John Doe',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of the administrator',
    example: 'admin@example.com',
  })
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'Organizations of the administrator',
    example: ['uuid', 'uuid'],
  })
  organizationIds: string[];
}
