import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'O\'quvchi ismi', example: 'Jasur' })
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString({ message: 'Ism matn bo\'lishi shart' })
  firstName: string;

  @ApiProperty({ description: 'O\'quvchi familiyasi', example: 'Raimov' })
  @IsNotEmpty({ message: 'Familiya kiritilishi shart' })
  @IsString({ message: 'Familiya matn bo\'lishi shart' })
  lastName: string;

  @ApiProperty({ description: 'O\'quvchi telefon raqami', example: '+998901112233' })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString({ message: 'Telefon raqami matn bo\'lishi shart' })
  phone: string;

  @ApiProperty({ description: 'Tug\'ilgan sana (ixtiyoriy)', example: '2005-08-15', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Tug\'ilgan sana yaroqli sana formati bo\'lishi shart' })
  birthDate?: string;

  @ApiProperty({ description: 'Status (faol/faol emas)', example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
