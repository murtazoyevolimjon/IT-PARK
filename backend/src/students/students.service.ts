import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    let whereClause: any = undefined;
    if (status === 'unpaid') {
      whereClause = {
        isPaid: false,
        status: 'ACTIVE',
      };
    } else if (status) {
      whereClause = { status };
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
    // Check existence
    await this.findOne(id);

    const { firstName, lastName, phone, secondPhone, birthDate, status, isPaid } = updateStudentDto;

    // If status is updated to INACTIVE, remove student from all groups
    if (status === 'INACTIVE') {
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async assignToGroups(studentId: number, groupIds: number[]) {
    const student = await this.findOne(studentId);

    if (student.status !== 'ACTIVE') {
      throw new BadRequestException('Nofaol o\'quvchini guruhga biriktirib bo\'lmaydi');
    }

    // Create GroupStudent records
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
