import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AuthController } from '@/modules/auth/application/controller/auth.controller';
import { AuthenticationService } from '@/modules/auth/application/useCases/auth-usecase';
import { AuthenticationDto } from '@/modules/auth/application/controller/dtos/auth.dto';
import { ForgotPasswordUseCase } from '@/modules/auth/application/useCases/forgot-password.usecase';
import { ResetPasswordUseCase } from '@/modules/auth/application/useCases/reset-password.usecase';
import { ForgotPasswordDTO } from '@/modules/auth/application/controller/dtos/forgot-password.dto';
import { ResetPasswordDTO } from '@/modules/auth/application/controller/dtos/reset-password.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authenticationService: AuthenticationService;
  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let resetPasswordUseCase: ResetPasswordUseCase;

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
        {
          provide: ForgotPasswordUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ResetPasswordUseCase,
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

    forgotPasswordUseCase = module.get<ForgotPasswordUseCase>(
      ForgotPasswordUseCase,
    );
    resetPasswordUseCase =
      module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
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

  describe('forgotPassword', () => {
    it('Deve chamar forgotPasswordUseCase.execute com os parametros corretos', async () => {
      const mockParams: ForgotPasswordDTO = {
        email: faker.internet.email(),
      };

      await authController.forgotPassword(mockParams);

      expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('resetPassword', () => {
    it('Deve chamar resetPasswordUseCase.execute com os parametros corretos', async () => {
      const mockParams: ResetPasswordDTO = {
        token: faker.string.alphanumeric(10),
        password: faker.internet.password(),
        confirmPassword: faker.internet.password(),
      };

      await authController.resetPassword(mockParams);

      expect(resetPasswordUseCase.execute).toHaveBeenCalledWith(mockParams);
    });
  });
});
