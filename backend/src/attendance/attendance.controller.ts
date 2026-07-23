import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { BulkAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Guruh o\'quvchilari va ularning ma\'lum sanadagi davomatini olish' })
  @ApiQuery({ name: 'date', required: true, description: 'Sana (YYYY-MM-DD)' })
  getGroupAttendance(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getGroupAttendanceForDate(groupId, date);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Guruh davomatini ommaviy saqlash/yangilash' })
  saveBulkAttendance(@Body() bulkDto: BulkAttendanceDto) {
    return this.attendanceService.saveBulkAttendance(bulkDto);
  }
}
