import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SendInviteAccountDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'example@example.com',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsEnum(['FREE', 'ENTERPRISE'])
  @ApiProperty({
    enum: ['FREE', 'ENTERPRISE'],
    required: true,
  })
  type: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      campaign: true,
    },
    required: false,
  })
  permissions: Record<string, boolean>;
}
