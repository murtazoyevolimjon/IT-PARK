import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Admin telefon raqami', example: '+998901234567' })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString({ message: 'Telefon raqami matn bo\'lishi shart' })
  phone: string;

  @ApiProperty({ description: 'Admin paroli', example: 'admin123' })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString({ message: 'Parol matn bo\'lishi shart' })
  password: string;
}
