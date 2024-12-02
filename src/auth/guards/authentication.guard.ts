
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No token, please login');
        }
        try {
            const payload = await this.jwtService.verifyAsync(//verifying the token
                token,
                {
                        secret: process.env.JWT_SECRET//getting the secret from the environment variables
                }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;//assigning the payload to the request object
        } catch {
            throw new UnauthorizedException('invalid token');//throwing an error if the token is invalid
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const token = request.cookies?.token || request.headers['authorization']?.split(' ')[1];

        return token;
    }
}