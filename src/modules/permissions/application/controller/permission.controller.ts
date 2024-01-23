import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePermissionUseCase } from '../useCases/create-permission.usecase';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import baseRoute from '@/config/routes/base-route';
import { ListPermissionUseCase } from '../useCases/list-permission.usecase';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller(`${baseRoute.base_url_v1}/permissions`)
@UseGuards(AuthGuard('jwt'))
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly listPermissionUseCase: ListPermissionUseCase,
  ) {}

  @Post()
  @ApiExcludeEndpoint()
  async createPermission(@Body() params: CreatePermissionDto) {
    return await this.createPermissionUseCase.execute(params);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiTags('permissions')
  @ApiResponse({
    status: 200,
    description: 'List of permissions',
    schema: {
      type: 'object',
      properties: {
        ['organization']: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        ['checkIn']: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        ['videoLibrary']: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  async listPermission(): Promise<any> {
    return await this.listPermissionUseCase.execute();
  }
}
