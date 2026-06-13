import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService();

export const generateTokens = async (userId: number, email: string) => {
  const payload = { userId, email };

  const accessToken = await jwtService.signAsync(payload as any, {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES as any,
  });

  const refreshToken = await jwtService.signAsync(payload as any, {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES as any,
  });

  return {
    accessToken,
    refreshToken,
  };
};