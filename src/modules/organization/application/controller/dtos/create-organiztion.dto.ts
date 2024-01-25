import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}
