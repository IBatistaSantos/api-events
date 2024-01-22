import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';

jest.mock('@/shared/infra/prisma/repository/prisma.client.service', () => {
  return {
    PrismaService: jest.fn(() => ({
      $connect: jest.fn(),
      enableShutdownHooks: jest.fn(),
      onModuleInit: jest.fn(),
    })),
  };
});

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
