import { IsNotEmpty, ValidateIf } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @ValidateIf((object, value) => value !== object.password, {
    message: 'As senhas não conferem',
  })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}
