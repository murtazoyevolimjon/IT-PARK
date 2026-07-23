import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Guruh nomi', example: 'English Evening' })
  @IsNotEmpty({ message: 'Guruh nomi kiritilishi shart' })
  @IsString({ message: 'Guruh nomi matn bo\'lishi shart' })
  name: string;

  @ApiProperty({ description: 'Kurs ID raqami', example: 1 })
  @IsNotEmpty({ message: 'Kurs ID kiritilishi shart' })
  @IsInt({ message: 'Kurs ID butun son bo\'lishi shart' })
  courseId: number;

  @ApiProperty({ description: 'O\'qituvchi ID raqami', example: 1 })
  @IsNotEmpty({ message: 'O\'qituvchi ID kiritilishi shart' })
  @IsInt({ message: 'O\'qituvchi ID butun son bo\'lishi shart' })
  teacherId: number;

  @ApiProperty({ description: 'Guruh dars boshlanish sanasi', example: '2026-06-01' })
  @IsNotEmpty({ message: 'Boshlanish sanasi kiritilishi shart' })
  @IsDateString({}, { message: 'Yaroqli sana formati bo\'lishi shart' })
  startDate: string;

  @ApiProperty({ description: 'Guruh dars tugash sanasi', example: '2026-12-01' })
  @IsNotEmpty({ message: 'Tugash sanasi kiritilishi shart' })
  @IsDateString({}, { message: 'Yaroqli sana formati bo\'lishi shart' })
  endDate: string;
}

export class UpdateGroupDto {
  @ApiProperty({ description: 'Guruh nomi', example: 'English Evening', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Kurs ID raqami', example: 1, required: false })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiProperty({ description: 'O\'qituvchi ID raqami', example: 1, required: false })
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @ApiProperty({ description: 'Guruh dars boshlanish sanasi', example: '2026-06-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Guruh dars tugash sanasi', example: '2026-12-01', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
