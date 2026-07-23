import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  private parseTimeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  async findAll(roomId?: number) {
    return this.prisma.schedule.findMany({
      where: roomId ? { roomId } : undefined,
      include: {
        group: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startMinutes: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            course: true,
            teacher: true,
          },
        },
        room: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Dars jadvali topilmadi');
    }

    return schedule;
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const { groupId, roomId, dayOfWeek, startTime, endTime } = createScheduleDto;

    // 1. Verify existence of group and room
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Guruh topilmadi');
    }

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Xona topilmadi');
    }

    // 2. Parse times
    const startM = this.parseTimeToMinutes(startTime);
    const endM = this.parseTimeToMinutes(endTime);

    if (startM >= endM) {
      throw new ConflictException('Dars boshlanish vaqti tugash vaqtidan oldin bo\'lishi shart');
    }

    // 3. Check Room Conflict
    const roomConflict = await this.prisma.schedule.findFirst({
      where: {
        roomId,
        dayOfWeek,
        AND: [
          { startMinutes: { lt: endM } },
          { endMinutes: { gt: startM } },
        ],
      },
      include: {
        group: true,
      },
    });

    if (roomConflict) {
      throw new ConflictException(
        `Xona bandligi to'qnashuvi! "${room.name}" ushbu kunda (${dayOfWeek}) va vaqtda (${roomConflict.startTime} - ${roomConflict.endTime}) "${roomConflict.group.name}" guruhi darsi bor.`,
      );
    }

    // 4. Check Teacher Conflict
    const teacherConflict = await this.prisma.schedule.findFirst({
      where: {
        group: {
          teacherId: group.teacherId,
        },
        dayOfWeek,
        AND: [
          { startMinutes: { lt: endM } },
          { endMinutes: { gt: startM } },
        ],
      },
      include: {
        group: {
          include: {
            teacher: true,
          },
        },
      },
    });

    if (teacherConflict) {
      const teacherName = `${teacherConflict.group.teacher.firstName} ${teacherConflict.group.teacher.lastName}`;
      throw new ConflictException(
        `O'qituvchi bandligi to'qnashuvi! O'qituvchi ${teacherName} ushbu kunda (${dayOfWeek}) va vaqtda (${teacherConflict.startTime} - ${teacherConflict.endTime}) "${teacherConflict.group.name}" guruhiga dars o'tadi.`,
      );
    }

    // 5. Create
    return this.prisma.schedule.create({
      data: {
        groupId,
        roomId,
        dayOfWeek,
        startTime,
        endTime,
        startMinutes: startM,
        endMinutes: endM,
      },
      include: {
        group: true,
        room: true,
      },
    });
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const existingSchedule = await this.findOne(id);

    const groupId = updateScheduleDto.groupId ?? existingSchedule.groupId;
    const roomId = updateScheduleDto.roomId ?? existingSchedule.roomId;
    const dayOfWeek = updateScheduleDto.dayOfWeek ?? existingSchedule.dayOfWeek;
    const startTime = updateScheduleDto.startTime ?? existingSchedule.startTime;
    const endTime = updateScheduleDto.endTime ?? existingSchedule.endTime;

    // Get group teacherId
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Guruh topilmadi');
    }

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Xona topilmadi');
    }

    const startM = this.parseTimeToMinutes(startTime);
    const endM = this.parseTimeToMinutes(endTime);

    if (startM >= endM) {
      throw new ConflictException('Dars boshlanish vaqti tugash vaqtidan oldin bo\'lishi shart');
    }

    // Room Conflict excluding current record
    const roomConflict = await this.prisma.schedule.findFirst({
      where: {
        roomId,
        dayOfWeek,
        id: { not: id },
        AND: [
          { startMinutes: { lt: endM } },
          { endMinutes: { gt: startM } },
        ],
      },
      include: {
        group: true,
      },
    });

    if (roomConflict) {
      throw new ConflictException(
        `Xona bandligi to'qnashuvi! "${room.name}" ushbu kunda (${dayOfWeek}) va vaqtda (${roomConflict.startTime} - ${roomConflict.endTime}) "${roomConflict.group.name}" guruhi darsi bor.`,
      );
    }

    // Teacher Conflict excluding current record
    const teacherConflict = await this.prisma.schedule.findFirst({
      where: {
        id: { not: id },
        group: {
          teacherId: group.teacherId,
        },
        dayOfWeek,
        AND: [
          { startMinutes: { lt: endM } },
          { endMinutes: { gt: startM } },
        ],
      },
      include: {
        group: {
          include: {
            teacher: true,
          },
        },
      },
    });

    if (teacherConflict) {
      const teacherName = `${teacherConflict.group.teacher.firstName} ${teacherConflict.group.teacher.lastName}`;
      throw new ConflictException(
        `O'qituvchi bandligi to'qnashuvi! O'qituvchi ${teacherName} ushbu kunda (${dayOfWeek}) va vaqtda (${teacherConflict.startTime} - ${teacherConflict.endTime}) "${teacherConflict.group.name}" guruhiga dars o'tadi.`,
      );
    }

    return this.prisma.schedule.update({
      where: { id },
      data: {
        groupId,
        roomId,
        dayOfWeek,
        startTime,
        endTime,
        startMinutes: startM,
        endMinutes: endM,
      },
      include: {
        group: true,
        room: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
