import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

class ListGuest {
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;
}

export class ImportGuestDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    name: 'eventId',
    type: String,
    required: true,
  })
  eventId: string;

  @ArrayNotEmpty()
  @ApiProperty({
    name: 'guests',
    type: ListGuest,
    isArray: true,
  })
  guests: ListGuest[];
}
