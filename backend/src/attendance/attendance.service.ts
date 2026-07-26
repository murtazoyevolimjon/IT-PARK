import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkAttendanceDto } from './dto/attendance.dto';
import { Attendance } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldAttendanceRecords() {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);
    thresholdDate.setUTCHours(0, 0, 0, 0);

    const deleted = await this.prisma.attendance.deleteMany({
      where: {
        date: {
          lt: thresholdDate,
        },
      },
    });

    console.log(`[Cron Job] Data retention cleanup completed: deleted ${deleted.count} records older than 30 days.`);
  }

  // Date parser to get date at midnight UTC
  private getMidnightDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async getGroupAttendanceForDate(groupId: number, dateStr: string) {
    // 1. Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      return [];
    }

    const targetDate = this.getMidnightDate(dateStr);

    // 2. Get students in the group
    const enrollments = await this.prisma.groupStudent.findMany({
      where: { groupId },
      include: {
        student: true,
      },
    });

    // 3. Get existing attendance for this date
    const attendances = await this.prisma.attendance.findMany({
      where: {
        groupId,
        date: targetDate,
      },
    });

    // 4. Merge
    const attendanceMap = new Map<number, Attendance>(
      attendances.map((a) => [a.studentId, a])
    );

    return enrollments.map((env) => {
      const student = env.student;
      const att = attendanceMap.get(student.id);

      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        isPaid: student.isPaid,
        attendanceId: att?.id || null,
        status: att?.status || null, // null means not marked yet
        comment: att?.comment || null,
      };
    });
  }

  async saveBulkAttendance(bulkDto: BulkAttendanceDto) {
    const { groupId, date, records } = bulkDto;

    // Verify group
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Guruh topilmadi');
    }

    const targetDate = this.getMidnightDate(date);

    // Use prisma transaction to save all records
    const operations = records.map((rec) => {
      return this.prisma.attendance.upsert({
        where: {
          studentId_groupId_date: {
            studentId: rec.studentId,
            groupId,
            date: targetDate,
          },
        },
        update: {
          status: rec.status,
          comment: rec.comment || null,
        },
        create: {
          studentId: rec.studentId,
          groupId,
          date: targetDate,
          status: rec.status,
          comment: rec.comment || null,
        },
      });
    });

    await this.prisma.$transaction(operations);
    return { success: true, count: records.length };
  }
}
