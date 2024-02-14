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
import { GuestModule } from './modules/guests/guest.module';
import { PanelistModule } from './modules/panelist/panelist.module';
import { SponsorModule } from './modules/sponsors/sponsor.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    AccountModule,
    AuthenticationModule,
    PermissionModule,
    UserModule,
    OrganizationModule,
    EventModule,
    SessionModule,
    LiveModule,
    GuestModule,
    PanelistModule,
    SponsorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
