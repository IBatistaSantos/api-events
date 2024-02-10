import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGuestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the guest',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the guest',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The event id',
    required: true,
  })
  eventId: string;
}
