import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/*
* Checks if the user has access to requested endpoint
* @param req - Express Request Object
* @param response - Express Response Object
* @param next - Express Next Function
* 
* @returns next Function or Throws an Error if user is not authenticated
*/
const isUserAuthorized = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction | void => {
    // Check if the user has the required role
    const userRoles = (req.user.role);
    if (!roles.some(role => userRoles.includes(role))) {
      throw new UnauthorizedException('User does not have the required role');
    }
    next();
  }
}

export default isUserAuthorized;