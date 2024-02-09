import { IsNotEmpty, IsOptional } from 'class-validator';

export class FinishLiveDTO {
  @IsOptional()
  @IsNotEmpty()
  finishedAt: Date;
}
