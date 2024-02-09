import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthenticationModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { UserModule } from './modules/users/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { EventModule } from './modules/events/event.module';
import { SessionModule } from './modules/sessions/session.module';
import { LiveModule } from './modules/lives/live.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AuthenticationModule,
    PermissionModule,
    UserModule,
    OrganizationModule,
    EventModule,
    SessionModule,
    LiveModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
