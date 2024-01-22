import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AuthController } from '@/modules/auth/application/controller/auth.controller';
import { AuthenticationService } from '@/modules/auth/application/useCases/auth-usecase';
import { AuthenticationDto } from '@/modules/auth/application/controller/dtos/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('create', () => {
    it('Deve chamar authenticationService.create com os parametros corretos', async () => {
      const mockParams: AuthenticationDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await authController.create(mockParams);

      expect(authenticationService.execute).toHaveBeenCalledWith(mockParams);
    });
  });
});
