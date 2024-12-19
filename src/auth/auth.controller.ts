import {Get, Body, Controller, HttpStatus, Post, HttpException, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { SignInDto } from './dto/SignInDto';
import { UserService } from '../user/services/user.service';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }


  //TESTED - WORKING
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res) {
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.password);
      console.log("result: ", result);
      res.cookie('token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        user: result.payload,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //API USED BY FRONTEND
  @Get('me')
  @UseGuards(AuthenticationGuard)
  async getMe(@Req() req: Request, @Res() res: Response) {
    const userBeforeAttributes = req.user;
    const user = await this.userService.findOne(req.user['sub']);
    return res.send({ user });
  }

  //TESTED - WORKING
  @Post('register')
  async signup(@Body() registerRequestDto: RegisterRequestDto) {
    try {
      // Call the userService to handle registration
      const result = await this.userService.create(registerRequestDto);

      // Return a success response with HTTP 201 Created status
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      // Handle specific errors, such as email already exists or validation errors
      if (error.status === 409) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'User already exists',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Catch any other errors and throw a generic internal server error
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during registration',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Res() response) {
    console.log('Logout called');
    try {
      // Clear the token cookie
      console.log('Clearing token cookie');
      response.clearCookie('token');
      console.log('Token cookie cleared');

      // Send a response back to the client
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Logged out successfully',
      });
      console.log('Logout response sent');
    } catch (error) {
      console.log('Logout error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during logout',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}