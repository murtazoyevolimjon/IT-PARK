import { IsNotEmpty, IsString, IsInt, Matches, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export class CreateScheduleDto {
  @ApiProperty({ description: 'Guruh ID raqami', example: 1 })
  @IsNotEmpty({ message: 'Guruh ID kiritilishi shart' })
  @IsInt({ message: 'Guruh ID butun son bo\'lishi shart' })
  groupId: number;

  @ApiProperty({ description: 'Xona ID raqami', example: 1 })
  @IsNotEmpty({ message: 'Xona ID kiritilishi shart' })
  @IsInt({ message: 'Xona ID butun son bo\'lishi shart' })
  roomId: number;

  @ApiProperty({ description: 'Hafta kuni', example: 'MONDAY', enum: DAYS })
  @IsNotEmpty({ message: 'Hafta kuni kiritilishi shart' })
  @IsString({ message: 'Hafta kuni matn bo\'lishi shart' })
  @IsIn(DAYS, { message: 'Hafta kuni faqat ingliz tilidagi katta harfli kunlar bo\'lishi shart (masalan: MONDAY)' })
  dayOfWeek: string;

  @ApiProperty({ description: 'Boshlanish vaqti (HH:MM)', example: '14:00' })
  @IsNotEmpty({ message: 'Boshlanish vaqti kiritilishi shart' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Boshlanish vaqti HH:MM formatida bo\'lishi shart' })
  startTime: string;

  @ApiProperty({ description: 'Tugash vaqti (HH:MM)', example: '15:30' })
  @IsNotEmpty({ message: 'Tugash vaqti kiritilishi shart' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Tugash vaqti HH:MM formatida bo\'lishi shart' })
  endTime: string;
}

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Guruh ID raqami', example: 1, required: false })
  @IsOptional()
  @IsInt()
  groupId?: number;

  @ApiProperty({ description: 'Xona ID raqami', example: 1, required: false })
  @IsOptional()
  @IsInt()
  roomId?: number;

  @ApiProperty({ description: 'Hafta kuni', example: 'MONDAY', enum: DAYS, required: false })
  @IsOptional()
  @IsString()
  @IsIn(DAYS)
  dayOfWeek?: string;

  @ApiProperty({ description: 'Boshlanish vaqti (HH:MM)', example: '14:00', required: false })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime?: string;

  @ApiProperty({ description: 'Tugash vaqti (HH:MM)', example: '15:30', required: false })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime?: string;
}
