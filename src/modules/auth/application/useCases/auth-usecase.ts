import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth-repository';

interface Input {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('EncryptProvider')
    private readonly encryption: EncryptProvider,
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,

    @Inject('JWTProvider')
    private jwtService: JWTProvider,
  ) {}

  async execute({ email, password }: Input) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(`Credentials invalid`);
    }

    const isMatch = await this.encryption.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException(`Credentials invalid`);
    }

    const accessToken = this.jwtService.generateToken({
      userId: user.id,
      type: user.type,
    });

    const userData = user.toJSON();
    delete userData.permissions;
    return {
      accessToken,
      user: userData,
    };
  }

  async validateUser(payload: any) {
    const user = await this.authRepository.findById(payload.userId);
    return user ? user.toJSON() : null;
  }
}
