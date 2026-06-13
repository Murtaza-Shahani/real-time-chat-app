import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { StrategiesModule } from './strategies/strategies.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET, // ✅ match your .env
      signOptions: { expiresIn: '1d' },
    }),
    StrategiesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService], 
})
export class AuthModule {}