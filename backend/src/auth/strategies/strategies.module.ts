import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [JwtStrategy], // ✅ REGISTER STRATEGY HERE
  exports: [JwtStrategy],
})
export class StrategiesModule {}