import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ description: 'Xona nomi yoki raqami', example: '101-xona' })
  @IsNotEmpty({ message: 'Xona nomi kiritilishi shart' })
  @IsString({ message: 'Xona nomi matn bo\'lishi shart' })
  name: string;

  @ApiProperty({ description: 'Xona sig\'imi (o\'quvchilar soni)', example: 15 })
  @IsNotEmpty({ message: 'Sig\'im kiritilishi shart' })
  @IsInt({ message: 'Sig\'im butun son bo\'lishi shart' })
  @Min(1, { message: 'Sig\'im kamida 1 bo\'lishi shart' })
  capacity: number;
}

export class UpdateRoomDto {
  @ApiProperty({ description: 'Xona nomi yoki raqami', example: '101-xona', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Xona sig\'imi (o\'quvchilar soni)', example: 15, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
