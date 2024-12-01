import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user.service'; 

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-jwt-secret',  // Change this to a more secure secret
      signOptions: { expiresIn: '60m' },  // Tokens will expire in 60 minutes
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
