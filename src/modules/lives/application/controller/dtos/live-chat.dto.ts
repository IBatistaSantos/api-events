import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class LiveChatDTO {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsNotEmpty()
  @IsEnum(['open', 'moderate'])
  type?: string;
}
