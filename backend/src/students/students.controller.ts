import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha o\'quvchilarni olish' })
  @ApiQuery({ name: 'status', required: false, description: 'Faqat ACTIVE yoki INACTIVE o\'quvchilarni olish' })
  findAll(@Query('status') status?: string) {
    return this.studentsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'O\'quvchi ma\'lumotlarini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi o\'quvchi yaratish' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'O\'quvchi ma\'lumotlarini tahrirlash' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'O\'quvchini o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }

  @Post(':id/groups')
  @ApiOperation({ summary: 'O\'quvchini guruhlarga biriktirish' })
  assignToGroups(
    @Param('id', ParseIntPipe) id: number,
    @Body('groupIds') groupIds: number[],
  ) {
    return this.studentsService.assignToGroups(id, groupIds);
  }

  @Delete(':id/groups/:groupId')
  @ApiOperation({ summary: 'O\'quvchini guruhdan chiqarish' })
  removeFromGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.studentsService.removeFromGroup(id, groupId);
  }
}
