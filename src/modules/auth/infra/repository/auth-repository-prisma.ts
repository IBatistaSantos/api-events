import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';

import { Injectable } from '@nestjs/common';
import { User } from '@/modules/users/domain/user';
import {
  AuthRepository,
  UpdateForgotPasswordInput,
} from '../../application/repository/auth-repository';

@Injectable()
export class AuthRepositoryPrisma implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { tokenForgotPassword: token },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      accountId: user.accountId,
      createdAt: user.createdAt,
      status: user.status,
      tokenForgotPassword: user.tokenForgotPassword,
      updatedAt: user.updatedAt,
      type: user.type,
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      accountId: user.accountId,
      createdAt: user.createdAt,
      status: user.status,
      updatedAt: user.updatedAt,
      type: user.type,
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      accountId: user.accountId,
      createdAt: user.createdAt,
      status: user.status,
      updatedAt: user.updatedAt,
      type: user.type,
    });
  }

  async updateForgotPasswordToken(
    params: UpdateForgotPasswordInput,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: params.id },
      data: {
        tokenForgotPassword: params.token,
      },
    });
  }

  async resetPassword(params: { id: string; password: string }): Promise<void> {
    await this.prisma.user.update({
      where: { id: params.id },
      data: {
        password: params.password,
        tokenForgotPassword: null,
      },
    });
  }
}
