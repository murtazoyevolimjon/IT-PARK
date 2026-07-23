import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Kurs nomi', example: 'Ingliz tili - General English' })
  @IsNotEmpty({ message: 'Kurs nomi kiritilishi shart' })
  @IsString({ message: 'Kurs nomi matn bo\'lishi shart' })
  name: string;

  @ApiProperty({ description: 'Kurs tavsifi (ixtiyoriy)', example: 'Boshlang\'ich darajadagilar uchun', required: false })
  @IsOptional()
  @IsString({ message: 'Kurs tavsifi matn bo\'lishi shart' })
  description?: string;
}

export class UpdateCourseDto {
  @ApiProperty({ description: 'Kurs nomi', example: 'Ingliz tili - General English', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Kurs tavsifi', example: 'Boshlang\'ich darajadagilar uchun', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
