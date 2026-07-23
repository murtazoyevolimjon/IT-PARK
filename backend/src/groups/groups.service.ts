import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      orderBy: { id: 'desc' },
      include: {
        course: true,
        teacher: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        course: true,
        teacher: true,
        schedules: {
          include: {
            room: true,
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Guruh topilmadi');
    }

    return group;
  }

  async create(createGroupDto: CreateGroupDto) {
    const { name, courseId, teacherId, startDate, endDate } = createGroupDto;

    // Verify course and teacher exist
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    const teacher = await this.prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException('O\'qituvchi topilmadi');
    }

    return this.prisma.group.create({
      data: {
        name,
        courseId,
        teacherId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    await this.findOne(id);
    const { name, courseId, teacherId, startDate, endDate } = updateGroupDto;

    if (courseId) {
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        throw new NotFoundException('Kurs topilmadi');
      }
    }

    if (teacherId) {
      const teacher = await this.prisma.teacher.findUnique({ where: { id: teacherId } });
      if (!teacher) {
        throw new NotFoundException('O\'qituvchi topilmadi');
      }
    }

    return this.prisma.group.update({
      where: { id },
      data: {
        name,
        courseId,
        teacherId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.group.delete({
      where: { id },
    });
  }
}
