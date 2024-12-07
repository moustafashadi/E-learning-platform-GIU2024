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
import { request } from 'http';
import { response } from 'express';
import { CreateStudentDto } from '../dto/create-student.dto';
import { createInstructorDto } from '../dto/create-instructor.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { role, ...userData } = createUserDto;

    const baseUser = {
      ...userData,
      role,
    };
  
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let userWithRoleSpecificFields;
  
    // Role-specific logic
    switch (role) {
      case 'admin':
        userWithRoleSpecificFields = await this.createAdmin({
          ...baseUser, // Admin might not need extra attributes
          password: hashedPassword,
        });
        break;
      case 'student':
        userWithRoleSpecificFields = await this.createStudent({
          ...baseUser,
          password: hashedPassword,
          enrolledCourses: [],
          completedCourses: [],
        });
        break;
      case 'instructor':
        userWithRoleSpecificFields = await this.createInstructor({
          ...baseUser,
          password: hashedPassword,
          coursesTaught: [],
        });
        break;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  
    return userWithRoleSpecificFields; // No need to call .save(), as .create() already saves the document  
  }
  
  async createStudent(studentData: CreateStudentDto) {
    return this.studentModel.create({ ...studentData, role: 'student' });
  }
  
  async createInstructor(instructorData: createInstructorDto) {
    return this.instructorModel.create({ ...instructorData, role: 'instructor' });
  }
  
  async createAdmin(adminData: CreateAdminDto) {
    return this.adminModel.create({ ...adminData, role: 'admin' });
  }

  async getCurrentUser(request: Request): Promise<UserDocument> {
    const token = request.cookies['token'];
    if (!token) {
      throw new NotFoundException('No JWT token found');
    }

    const decoded = this.jwtService.verify(token);
    const userId = decoded.sub;
    switch (decoded.role) {
      case 'admin':
        return this.adminModel.findById(userId);
      case 'student':
        return this.studentModel.findById(userId);
      case 'instructor':
        return this.instructorModel.findById(userId);
      default:
        throw new NotFoundException('User not found');
    }
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
    return this.studentModel.findOne({ email }).exec();
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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10);
    }

    Object.assign(user, updateProfileDto);
    return await user.save();
  }

  async getEnrolledCourses(userId: string) {
    const user = await this.studentModel.findById(userId)
      .populate('enrolledCourses')
      .exec();
    return user.enrolledCourses;
  }

  async getCompletedCourses(userId: string) {
    const user = await this.studentModel.findById(userId)
      .populate('completedCourses')
      .exec();
    return user?.completedCourses || [];
  }

  async getCoursesTaught(userId: string) {
    const user = await this.instructorModel.findById(userId)
      .populate('coursesTaught')
      .exec();
    return user?.coursesTaught || [];
  }


  }
