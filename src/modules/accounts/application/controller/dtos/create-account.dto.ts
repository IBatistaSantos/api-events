import { Match } from '@/shared/decorator/match-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountDTO {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({
    example: 'example',
    minLength: 4,
    format: 'password',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(4)
  @Match('password')
  @ApiProperty({
    example: 'example',
    minLength: 4,
    format: 'password',
  })
  confirmPassword: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'token',
    required: true,
  })
  token: string;
}
