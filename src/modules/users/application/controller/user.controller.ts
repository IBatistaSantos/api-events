import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetProfileUseCase } from '../useCases/get-profile.usecase';
import baseRoute from '@/config/routes/base-route';
import { JwtAuthGuard } from '@/modules/auth/application/guard/jwt-auth.guard';
import { GetUser } from '@/shared/decorator/get-decorator';
import { ApplyPermissionUseCase } from '../useCases/apply-permission.usecase';
import { ApplyPermissionDTO } from './dtos/apply-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(`${baseRoute.base_url_v1}/users`)
@ApiTags('users')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly applyPermissionsUseCase: ApplyPermissionUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: any) {
    return await this.getProfileUseCase.execute(user.id);
  }

  @Post('/permissions')
  @UseGuards(JwtAuthGuard)
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
}
