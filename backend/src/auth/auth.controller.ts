import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli kirildi' })
  @ApiResponse({ status: 401, description: 'Xato ma\'lumotlar' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari muvaffaqiyatli olindi' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan' })
  getProfile(@Request() req) {
    return req.user;
  }
}
