import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { AccountModule } from './modules/accounts/account.module';
import { AuthenticationModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AccountModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
