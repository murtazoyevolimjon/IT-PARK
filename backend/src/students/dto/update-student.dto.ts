import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiProperty({ description: 'O\'quvchi ismi', example: 'Jasur', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'O\'quvchi familiyasi', example: 'Raimov', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'O\'quvchi telefon raqami', example: '+998901112233', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Tug\'ilgan sana', example: '2005-08-15', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ description: 'Status (ACTIVE/INACTIVE)', example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
