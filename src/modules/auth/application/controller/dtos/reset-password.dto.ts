import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @ApiProperty({
    example: 'any-password',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @ValidateIf((object, value) => value !== object.password, {
    message: 'As senhas não conferem',
  })
  @ApiProperty({
    example: 'any-password',
  })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Token é obrigatório' })
  @ApiProperty({
    example: 'any-token',
  })
  token: string;
}
