import { Body, Controller, Post } from '@nestjs/common';
import baseRoute from '@/config/routes/base-route';
import { SendInviteAccountUseCase } from '../useCases/send-invite-account-useCase';
import { SendInviteAccountDTO } from './dtos/send-invite.dto';
import { CreateAccountUseCase } from '../useCases/create-account-usecase';
import { CreateAccountDTO } from './dtos/create-account.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(`${baseRoute.base_url_v1}/accounts`)
@ApiTags('accounts')
export class AccountController {
  constructor(
    private readonly sendInviteAccountUseCase: SendInviteAccountUseCase,
    private readonly createAccountUseCase: CreateAccountUseCase,
  ) {}

  @Post('/invite')
  @ApiResponse({
    status: 201,
    description: 'Invite for create account',
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
          example: 'Account already exists',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async sendInvite(@Body() params: SendInviteAccountDTO) {
    return this.sendInviteAccountUseCase.execute({
      email: params.email,
      name: params.name,
      permissions: params.permissions,
      type: params.type,
    });
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Create account',
    schema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          example: 'uuid',
        },
        managerId: {
          type: 'string',
          example: 'uuid',
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
          example: 'Password and confirm password must be equals',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
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
          example: 'Invalid token',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
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
          example: 'Token expired',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async createAccount(@Body() params: CreateAccountDTO) {
    return this.createAccountUseCase.execute({
      password: params.password,
      confirmPassword: params.confirmPassword,
      token: params.token,
    });
  }
}
