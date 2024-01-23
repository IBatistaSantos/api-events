import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthenticationModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AuthenticationModule,
    PermissionModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
