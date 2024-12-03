import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../models/user.schema';
import { Admin, AdminDocument } from '../models/user.schema';
import { Student, StudentDocument } from '../models/user.schema';
import { Instructor, InstructorDocument } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
  ) {}

  async create(user: CreateUserDto): Promise<UserDocument> {//createUserDto is the data transfer object that contains the user data
    const { role, email, ...userData } = user;

    // Check if a user with the same email already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    let createdUser;

    switch (role) {
      case 'admin':
        createdUser = new this.adminModel({
          ...user,
          name: user.username,
          password: hashedPassword,
          roles: [user.role]
        });
        break;
      case 'student':
        createdUser = new this.studentModel({
          ...user,
          name: user.username,
          password: hashedPassword,
          roles: [user.role],
          ...(user.role === 'student' && { completedCourses: [], enrolledCourses: [] }),
        });
        break;
      case 'instructor':
        createdUser = new this.instructorModel({
          ...user,
          name: user.username,
          password: hashedPassword,
          roles: [user.role],
          ...(user.role === 'instructor' && {coursesTaught: [] }),
        });
        break;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
    
    return createdUser.save();

  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
      
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
