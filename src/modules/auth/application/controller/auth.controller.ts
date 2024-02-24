import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import baseRoute from '@/config/routes/base-route';
import { AuthenticationService } from '../useCases/auth-usecase';
import { AuthenticationDto } from './dtos/auth.dto';
import { ForgotPasswordUseCase } from '../useCases/forgot-password.usecase';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { ResetPasswordUseCase } from '../useCases/reset-password.usecase';
import { ResetPasswordDTO } from './dtos/reset-password.dto';

@Controller(`${baseRoute.base_url_v1}/auth`)
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly forgotPasswordService: ForgotPasswordUseCase,
    private readonly resetPasswordService: ResetPasswordUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Authentication',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'token',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'uuid',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'example@example',
            },
            type: {
              type: 'string',
              example: 'ADMIN',
            },
            status: {
              type: 'string',
              example: 'ACTIVE',
            },
            accountId: {
              type: 'string',
              example: 'uuid',
            },
            createdAt: {
              type: 'string',
              example: '2021-02-25T14:47:44.000Z',
            },
            updatedAt: {
              type: 'string',
              example: '2021-02-25T14:47:44.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Credentials invalid',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async create(@Body() authenticationDto: AuthenticationDto) {
    return await this.authService.execute(authenticationDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    return await this.forgotPasswordService.execute(body);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return await this.resetPasswordService.execute(body);
  }
}
