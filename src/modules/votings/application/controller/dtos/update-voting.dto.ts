import { ArrayNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { QuestionsDTO } from './questions.dto';
import { TargetAudience } from '@/modules/votings/domain/voting';

export class UpdateVotingDTO {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsOptional()
  timeInSeconds: number;

  @IsEnum(
    {
      all: 'all',
      presencial: 'presencial',
      digital: 'digital',
    },
    {
      message: 'Audiência alvo inválida',
    },
  )
  @IsOptional()
  targetAudience: TargetAudience;

  @ArrayNotEmpty({ message: 'Perguntas não podem ser vazias' })
  @IsOptional()
  questions: QuestionsDTO[];
}
