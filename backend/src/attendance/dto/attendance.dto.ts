import { IsNotEmpty, IsInt, IsString, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceRecordDto {
  @ApiProperty({ description: 'O\'quvchi ID raqami', example: 1 })
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty({ description: 'Davomat statusi', example: 'kelgan', enum: ['kelgan', 'kelmagan', 'sababli'] })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Izoh', example: 'Kasal bo\'lgan', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class BulkAttendanceDto {
  @ApiProperty({ description: 'Guruh ID raqami', example: 1 })
  @IsNotEmpty()
  @IsInt()
  groupId: number;

  @ApiProperty({ description: 'Sana (YYYY-MM-DD)', example: '2026-06-08' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'O\'quvchilar davomati ro\'yxati', type: [AttendanceRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records: AttendanceRecordDto[];
}
