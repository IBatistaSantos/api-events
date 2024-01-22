import { Global, Module } from '@nestjs/common';
import { PrismaService } from './repository/prisma.client.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
