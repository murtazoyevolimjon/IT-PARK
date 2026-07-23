import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SchedulesService } from './schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Dars jadvallarini olish' })
  @ApiQuery({ name: 'roomId', required: false, description: 'Faqat ma\'lum bir xonaning dars jadvallarini olish' })
  findAll(@Query('roomId') roomId?: string) {
    const parsedRoomId = roomId ? parseInt(roomId, 10) : undefined;
    return this.schedulesService.findAll(parsedRoomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Dars jadvalini ID bo\'yicha olish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi dars jadvali qo\'shish (To\'qnashuvlar avtomatik tekshiriladi)' })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Dars jadvalini tahrirlash (To\'qnashuvlar avtomatik tekshiriladi)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dars jadvalini o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.remove(id);
  }
}
