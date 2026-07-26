import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'O\'qituvchi ismi', example: 'Eshmat' })
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString({ message: 'Ism matn bo\'lishi shart' })
  firstName: string;

  @ApiProperty({ description: 'O\'qituvchi familiyasi', example: 'Toshmatov' })
  @IsNotEmpty({ message: 'Familiya kiritilishi shart' })
  @IsString({ message: 'Familiya matn bo\'lishi shart' })
  lastName: string;

  @ApiProperty({ description: 'O\'qituvchi telefon raqami', example: '+998911112233' })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString({ message: 'Telefon raqami matn bo\'lishi shart' })
  phone: string;

  @ApiProperty({ description: 'Qo\'shimcha telefon raqami (ixtiyoriy)', example: '+998909998877', required: false })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  secondPhone?: string;

  @ApiProperty({ description: 'Fani yoki yo\'nalishi', example: 'Ingliz tili' })
  @IsNotEmpty({ message: 'Fan nomi kiritilishi shart' })
  @IsString({ message: 'Fan nomi matn bo\'lishi shart' })
  subject: string;
}

export class UpdateTeacherDto {
  @ApiProperty({ description: 'O\'qituvchi ismi', example: 'Eshmat', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'O\'qituvchi familiyasi', example: 'Toshmatov', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'O\'qituvchi telefon raqami', example: '+998911112233', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Qo\'shimcha telefon raqami (ixtiyoriy)', example: '+998909998877', required: false })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  secondPhone?: string;

  @ApiProperty({ description: 'Fani yoki yo\'nalishi', example: 'Ingliz tili', required: false })
  @IsOptional()
  @IsString()
  subject?: string;
}
