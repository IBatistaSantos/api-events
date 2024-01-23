import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class ApplyPermissionDTO {
  @ArrayNotEmpty()
  permissions: string[];

  @IsNotEmpty()
  userId: string;
}
