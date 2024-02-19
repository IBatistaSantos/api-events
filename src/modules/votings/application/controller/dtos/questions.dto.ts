import { QuestionType } from '@/modules/votings/domain/question';
import { ArrayNotEmpty, IsEnum, IsString, ValidateIf } from 'class-validator';

export class QuestionsDTO {
  @IsString({
    message: 'Título da pergunta inválido',
  })
  title: string;

  @IsEnum(
    {
      text: 'text',
      multipleChoice: 'multiple-choice',
      singleChoice: 'single-choice',
    },
    {
      message: 'Tipo de pergunta inválido',
    },
  )
  type: QuestionType;

  @ValidateIf((o) => o.type === 'multiple-choice' || o.type === 'single-choice')
  @ArrayNotEmpty({ message: 'Opções inválidas' })
  options: string[];
}
