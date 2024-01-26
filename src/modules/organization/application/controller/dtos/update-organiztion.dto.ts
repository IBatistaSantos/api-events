import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}
