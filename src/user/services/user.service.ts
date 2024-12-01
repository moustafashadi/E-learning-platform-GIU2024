import { Injectable } from '@nestjs/common';
import { UserDocument } from '../models/user.schema'; // Import the User schema if you're using Mongoose
import * as bcrypt from 'bcryptjs'; // For comparing passwords

@Injectable()
export class UserService {
  private readonly users: UserDocument[] = []; // This is an example; you'll interact with a database here.

  // Create a new user
  async create(createUserDto: any): Promise<UserDocument> {
    const newUser = { ...createUserDto }; // This should be your database create logic.
    this.users.push(newUser);
    return newUser;
  }

  // Validate user credentials (email and password)
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = this.users.find((user) => user.email === email); // Query from your database here.
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
