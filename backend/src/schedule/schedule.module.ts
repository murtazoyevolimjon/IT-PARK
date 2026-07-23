import { Module } from '@nestjs/common';
import { SchedulesService } from './schedule.service';
import { SchedulesController } from './schedule.controller';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
