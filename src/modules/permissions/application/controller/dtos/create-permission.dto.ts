import { PermissionAvailable } from '@/modules/permissions/domain/permission';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(PermissionAvailable)
  content: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
