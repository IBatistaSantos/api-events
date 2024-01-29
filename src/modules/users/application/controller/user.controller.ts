import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetProfileUseCase } from '../useCases/get-profile.usecase';
import baseRoute from '@/config/routes/base-route';
import { JwtAuthGuard } from '@/modules/auth/application/guard/jwt-auth.guard';
import { GetUser } from '@/shared/decorator/get-decorator';
import { ApplyPermissionUseCase } from '../useCases/apply-permission.usecase';
import { ApplyPermissionDTO } from './dtos/apply-permission.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAdministratorUseCase } from '../useCases/create-administrator.usecase';
import { CreateAdministratorDTO } from './dtos/create-administrator.dto';

@Controller(`${baseRoute.base_url_v1}/users`)
@ApiTags('users')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly applyPermissionsUseCase: ApplyPermissionUseCase,
    private readonly createAdministratorUseCase: CreateAdministratorUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    schema: {
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
          example: 'anonymous@example',
        },
      },
    },
  })
  async getProfile(@GetUser() user: any) {
    return await this.getProfileUseCase.execute(user.id);
  }

  @Post('/permissions')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  async applyPermissions(
    @GetUser() user: any,
    @Body() params: ApplyPermissionDTO,
  ) {
    const data = {
      adminId: user.id,
      ...params,
    };
    return await this.applyPermissionsUseCase.execute(data);
  }

  @Post('/administrators')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    schema: {
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
          example: 'admin@example.com',
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
          example: 'Account already exists',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async createAdministrators(
    @GetUser() user: any,
    @Body() params: CreateAdministratorDTO,
  ) {
    return await this.createAdministratorUseCase.execute({
      email: params.email,
      name: params.name,
      organizationIds: params.organizationIds,
      userId: user.id,
    });
  }
}
