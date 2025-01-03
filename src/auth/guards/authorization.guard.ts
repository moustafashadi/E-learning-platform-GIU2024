import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    //.getHandler() returns the handler method of the request eg. createNote, findAllNotes, findNoteById
    //.getClass() returns the class of the handler method eg. NotesController
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [//getting the required roles from the reflector
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    
      const { user } = context.switchToHttp().getRequest(); //getting the user from the request
      if(!user)
        throw new UnauthorizedException('no user attached');
      const userRole = user.role//getting the role of the user
      if (!requiredRoles.includes(userRole)) //checking if the user has the required role
        throw new UnauthorizedException('unauthorized access');
       
    return true;
  }
}