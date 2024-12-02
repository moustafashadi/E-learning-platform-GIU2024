import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import * as bcrypt from 'bcryptjs'; // For comparing passwords

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

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

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
