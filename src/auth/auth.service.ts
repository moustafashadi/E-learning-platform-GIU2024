//knk
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service'; // UserService to manage users
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs'; 
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  // Register a new user
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({ email, password: hashedPassword, name });
    return { message: 'User registered successfully' };
  }

  // Login and generate JWT token
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
