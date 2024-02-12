import { ArrayNotEmpty } from 'class-validator';

export class UpdatePositionPanelistDTO {
  @ArrayNotEmpty({
    message: 'A lista de panelista não pode ser vazia.',
  })
  panelistIds: string[];
}
