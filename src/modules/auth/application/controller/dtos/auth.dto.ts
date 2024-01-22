import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticationDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'example@example',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({
    description: 'Password',
    example: '1234',
    required: true,
    format: 'password',
  })
  password: string;
}
