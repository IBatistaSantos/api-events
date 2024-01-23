import { Body, Controller, Post } from '@nestjs/common';
import { CreatePermissionUseCase } from '../useCases/create-permission.usecase';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import baseRoute from '@/config/routes/base-route';

@Controller(`${baseRoute.base_url_v1}/permissions`)
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
  ) {}

  @Post()
  async createPermission(@Body() params: CreatePermissionDto) {
    return await this.createPermissionUseCase.execute(params);
  }
}
