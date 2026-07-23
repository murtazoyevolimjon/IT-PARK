import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    // 1. Total counts
    const students = await this.prisma.student.count();
    const activeStudents = await this.prisma.student.count({ where: { status: 'ACTIVE' } });
    const teachers = await this.prisma.teacher.count();
    const groups = await this.prisma.group.count();
    const rooms = await this.prisma.room.count();

    // 2. Today's schedules
    const weekdayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayIndex = new Date().getDay();
    const todayName = weekdayNames[todayIndex];

    const todaySchedules = await this.prisma.schedule.findMany({
      where: {
        dayOfWeek: todayName,
      },
      include: {
        group: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
      orderBy: {
        startMinutes: 'asc',
      },
    });

    // 3. Attendance Stats (last 7 days of attendance entries)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group attendances by date
    const attendanceByDateMap = new Map<string, { present: number; absent: number; excused: number }>();
    attendances.forEach((att) => {
      const dateStr = att.date.toISOString().split('T')[0];
      const current = attendanceByDateMap.get(dateStr) || { present: 0, absent: 0, excused: 0 };
      
      if (att.status === 'kelgan') {
        current.present++;
      } else if (att.status === 'kelmagan') {
        current.absent++;
      } else if (att.status === 'sababli') {
        current.excused++;
      }
      attendanceByDateMap.set(dateStr, current);
    });

    const attendanceTrend = Array.from(attendanceByDateMap.entries()).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    // 4. Room Occupancy Stats (Schedules count per room)
    const roomSchedules = await this.prisma.room.findMany({
      include: {
        _count: {
          select: {
            schedules: true,
          },
        },
      },
    });

    const roomOccupancy = roomSchedules.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      lessonCount: room._count.schedules,
    }));

    // Calculate global attendance rates
    const totalAttendances = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'kelgan').length;
    const attendancePercentage = totalAttendances > 0 
      ? Math.round((presentCount / totalAttendances) * 100) 
      : 100;

    return {
      stats: {
        students,
        activeStudents,
        teachers,
        groups,
        rooms,
        globalAttendanceRate: attendancePercentage
      },
      todaySchedules,
      attendanceTrend,
      roomOccupancy,
    };
  }
}
