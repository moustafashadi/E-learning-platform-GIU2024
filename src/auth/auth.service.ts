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
    async register(user: RegisterRequestDto): Promise<string> {
        const existingUser = await this.usersService.findByEmail(user.email);
        if (existingUser) {
          throw new ConflictException('email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: RegisterRequestDto = { ...user, password: hashedPassword };
        await this.usersService.create(newUser);
        return 'registered successfully';
      }

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
            userid: user._id as unknown as Types.ObjectId, //Explicitly telling TypeScript that we're treating the _id as a Mongoose ObjectId
            role: user.roles[0]
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            payload
        };
    }
}