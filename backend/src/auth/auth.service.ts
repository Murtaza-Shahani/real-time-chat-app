import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/auth.dto';
import { generateTokens } from 'src/common/helper/helper';

import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ✅ SIGNUP
  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
      userId: user.id,
    };
  }

  // ✅ LOGIN
  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      await generateTokens(user.id, user.email);

    // hash refresh token before saving
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      10,
    );
    console.log('Generated Access Token:', accessToken);
    console.log('Generated Refresh Token:', refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    // send refresh token as cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  // ✅ LOGOUT
  async logout(userId: number, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie('refresh_token');

    return {
      message: 'Logged out',
    };
  }

  // ✅ REFRESH TOKEN
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        'No refresh token provided',
      );
    }

    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // compare refresh token
    const isRefreshTokenMatches =
      await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

    if (!isRefreshTokenMatches) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    const tokens = await generateTokens(
      user.id,
      user.email,
    );

    const hashedRefreshToken = await bcrypt.hash(
      tokens.refreshToken,
      10,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    res.cookie(
      'refresh_token',
      tokens.refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );

    return {
      access_token: tokens.accessToken,
    };
  }
}