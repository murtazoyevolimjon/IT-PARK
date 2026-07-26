import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    let whereClause: any = { status: { not: 'ARCHIVED' } };

    if (status === 'unpaid') {
      whereClause = {
        isPaid: false,
        status: { not: 'ARCHIVED' },
      };
    } else if (status === 'ARCHIVED') {
      whereClause = { status: 'ARCHIVED' };
    } else if (status && status !== 'all') {
      whereClause = { status };
    } else if (status === 'all') {
      whereClause = { status: { not: 'ARCHIVED' } };
    }

    return this.prisma.student.findMany({
      where: whereClause,
      orderBy: { joinedAt: 'desc' },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            group: {
              include: {
                course: true,
                teacher: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('O\'quvchi topilmadi');
    }

    return student;
  }

  async create(createStudentDto: CreateStudentDto) {
    const { firstName, lastName, phone, secondPhone, birthDate, status, isPaid } = createStudentDto;
    return this.prisma.student.create({
      data: {
        firstName,
        lastName,
        phone,
        secondPhone,
        birthDate: birthDate ? new Date(birthDate) : null,
        status: status || 'ACTIVE',
        isPaid: isPaid !== undefined ? isPaid : true,
      },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    const { firstName, lastName, phone, secondPhone, birthDate, status, isPaid } = updateStudentDto;

    if (status === 'INACTIVE' || status === 'ARCHIVED') {
      await this.prisma.groupStudent.deleteMany({
        where: { studentId: id },
      });
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone,
        secondPhone,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        status,
        isPaid,
      },
    });
  }

  // Soft delete / archive student
  async remove(id: number, permanent?: boolean) {
    await this.findOne(id);

    if (permanent) {
      return this.prisma.student.delete({
        where: { id },
      });
    }

    // Soft delete: remove active group enrollments and mark as ARCHIVED
    await this.prisma.groupStudent.deleteMany({
      where: { studentId: id },
    });

    return this.prisma.student.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  // Restore archived student back to ACTIVE
  async restore(id: number) {
    await this.findOne(id);
    return this.prisma.student.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async assignToGroups(studentId: number, groupIds: number[]) {
    const student = await this.findOne(studentId);

    if (student.status !== 'ACTIVE') {
      throw new BadRequestException('Nofaol yoki arxivlangan o\'quvchini guruhga biriktirib bo\'lmaydi');
    }

    const operations = groupIds.map((groupId) =>
      this.prisma.groupStudent.upsert({
        where: {
          groupId_studentId: {
            groupId,
            studentId,
          },
        },
        update: {},
        create: {
          groupId,
          studentId,
        },
      }),
    );

    await this.prisma.$transaction(operations);
    return this.findOne(studentId);
  }

  async removeFromGroup(studentId: number, groupId: number) {
    await this.findOne(studentId);

    await this.prisma.groupStudent.delete({
      where: {
        groupId_studentId: {
          groupId,
          studentId,
        },
      },
    });

    return this.findOne(studentId);
  }
}
