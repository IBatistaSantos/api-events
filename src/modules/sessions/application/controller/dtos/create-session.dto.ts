import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionDTO {
  @IsNotEmpty()
  eventId: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  hourStart: string;

  @IsNotEmpty()
  @IsOptional()
  hourEnd: string;
}
