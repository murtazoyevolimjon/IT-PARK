import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.room.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Xona topilmadi');
    }

    return room;
  }

  async create(createRoomDto: CreateRoomDto) {
    const { name, capacity } = createRoomDto;

    // Check unique name
    const existing = await this.prisma.room.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException('Bunday nomli xona allaqachon mavjud');
    }

    return this.prisma.room.create({
      data: { name, capacity },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    const { name, capacity } = updateRoomDto;

    if (name) {
      const existing = await this.prisma.room.findFirst({
        where: { name, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException('Bunday nomli xona allaqachon mavjud');
      }
    }

    return this.prisma.room.update({
      where: { id },
      data: { name, capacity },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
