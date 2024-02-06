import { IsNotEmpty, IsOptional } from 'class-validator';

export class FinishSessionDTO {
  @IsOptional()
  @IsNotEmpty()
  hourEnd: string;
}
