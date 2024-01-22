import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import {
  AccountInvite,
  AccountRepository,
  SaveInviteParams,
} from '../../application/repository/account-repository';
import { Account } from '../../domain/account';
import { AccountType, UserType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { User } from '@/modules/users/domain/user';

@Injectable()
export class AccountRepositoryPrisma implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<AccountInvite> {
    const invite = await this.prisma.inviteAccount.findUnique({
      where: { token },
    });

    if (!invite) {
      return null;
    }

    return {
      id: invite.id,
      name: invite.name,
      email: invite.email,
      type: invite.type,
      permissions: {
        event: invite.event,
        organization: invite.organization,
        certificate: invite.certificate,
        campaign: invite.campaign,
        checkIn: invite.checkin,
        videoLibrary: invite.videoLibrary,
        lobby: invite.lobby,
      },
    };
  }

  async save(account: Account, manager: User): Promise<void> {
    const permissions = account.accountPermissions.value;
    const managerJSON = manager.toJSON();
    await this.prisma.$transaction([
      this.prisma.account.create({
        data: {
          id: account.id,
          type: account.type as AccountType,
          event: permissions.event,
          organization: permissions.organization,
          certificate: permissions.certificate,
          campaign: permissions.campaign,
          checkin: permissions.checkIn,
          videoLibrary: permissions.videoLibrary,
          lobby: permissions.lobby,
        },
      }),
      this.prisma.user.create({
        data: {
          id: manager.id,
          name: managerJSON.name,
          email: managerJSON.email,
          password: manager.password,
          type: managerJSON.type as UserType,
          accountId: manager.accountId,
        },
      }),
    ]);
  }

  async deleteInvite(token: string): Promise<void> {
    await this.prisma.inviteAccount.delete({
      where: { token: token },
    });
  }

  async saveInvite(params: SaveInviteParams): Promise<void> {
    const { account } = params;
    const permissions = account.accountPermissions.value;
    await this.prisma.inviteAccount.create({
      data: {
        name: params.name,
        email: params.email,
        type: account.type as AccountType,
        token: params.token,
        campaign: permissions.campaign,
        certificate: permissions.certificate,
        checkin: permissions.checkIn || true,
        event: permissions.event || true,
        lobby: permissions.lobby,
        organization: permissions.organization || true,
        videoLibrary: permissions.videoLibrary,
      },
    });
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { email, status: 'ACTIVE', type: 'MASTER' },
      include: {
        account: {},
      },
    });

    if (!user) {
      return undefined;
    }

    const account = user.account;

    const permissions = {
      event: account.event,
      organization: account.organization,
      certificate: account.certificate,
      campaign: account.campaign,
      checkin: account.checkin,
      videoLibrary: account.videoLibrary,
      lobby: account.lobby,
    };

    return new Account({
      id: account.id,
      type: account.type,
      accountPermissions: permissions,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }
}
