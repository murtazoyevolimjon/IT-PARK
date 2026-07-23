import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany({
      orderBy: { id: 'desc' },
      include: {
        groups: true,
      },
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('O\'qituvchi topilmadi');
    }

    return teacher;
  }

  async create(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: createTeacherDto,
    });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(id);
    return this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.teacher.delete({
      where: { id },
    });
  }
}
