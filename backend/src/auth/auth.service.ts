import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let { phone, password } = loginDto;

    // Normalize phone number: remove spaces, dashes, brackets, prepend + if 998 format
    phone = phone.replace(/[\s\-\(\)]/g, '');
    if (/^998\d{9}$/.test(phone)) {
      phone = '+' + phone;
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Telefon raqami yoki parol noto\'g\'ri');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Telefon raqami yoki parol noto\'g\'ri');
    }

    // Generate JWT
    const payload = { sub: user.id, phone: user.phone, name: user.name };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token: token,
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
