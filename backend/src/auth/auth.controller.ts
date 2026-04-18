import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Get('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
getMe(@GetUser() user) {
  return user;
}
}