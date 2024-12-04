import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { ObjectId, Types } from 'mongoose';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<{ access_token: string, payload: { userid: Types.ObjectId, role: string } }> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        console.log("password: ", user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log( await bcrypt.compare(password, user.password))
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            userid: user._id as unknown as Types.ObjectId,
            role: user.role.toLowerCase()
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            payload
        };
    }
}