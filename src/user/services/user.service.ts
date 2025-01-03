import { Injectable, NotFoundException, ConflictException, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../models/user.schema';
import { Admin, AdminDocument } from '../models/user.schema';
import { Student, StudentDocument } from '../models/user.schema';
import { Instructor, InstructorDocument } from '../models/user.schema';
import { CreateStudentDto } from '../dto/create-student.dto';
import { createInstructorDto } from '../dto/create-instructor.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Course, CourseDocument } from '../../course/models/course.schema';
import { updateStudentDto } from '../dto/update-student.dto';
import { Progress } from 'src/progress/models/progress.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      console.log('Starting user creation with:', { ...createUserDto, password: '***' });

      const { role, ...userData } = createUserDto;

      // Check if email already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const baseUser = {
        ...userData,
        role,
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      let userWithRoleSpecificFields;

      console.log('Creating user with role:', role);

      // Role-specific logic
      switch (role.toLowerCase()) {
        case 'admin':
          userWithRoleSpecificFields = await this.createAdmin({
            ...baseUser,
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

      return userWithRoleSpecificFields;
    } catch (error) {
      console.error('User creation error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
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

  // DO NOT USE OUTSIDE OF USER MODULE
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

  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');
    res.status(200).send({
      statusCode: 200,
      message: 'Logged out successfully',
    });
  }

  async findAll(): Promise<UserDocument[]> {
    const students = await this.studentModel.find().exec();
    const instructors = await this.instructorModel.find().exec();
    const admins = await this.adminModel.find().exec();
    return [...students, ...instructors, ...admins];
  }

  async findOne(id: string): Promise<UserDocument> {
    const student = await this.studentModel.findById(id).exec();
    if (student) return student;

    const instructor = await this.instructorModel.findById(id).exec();
    if (instructor) return instructor;

    const admin = await this.adminModel.findById(id).exec();
    if (admin) return admin;

    else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    //Check all user types
    const student = await this.studentModel.findOne({ email }).exec();
    if (student) return student;

    const instructor = await this.instructorModel.findOne({ email }).exec();
    if (instructor) return instructor;

    const admin = await this.adminModel.findOne({ email }).exec();
    if (admin) return admin;

    return null;
  }

  async updateStudent(id: string, updateStudentDto: updateStudentDto): Promise<UserDocument> {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    if (updatedStudent) return updatedStudent;
    else {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    // Hash password if it is being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
  
    // Update student model
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      updateUserDto, // Correct variable name
      { new: true }  // Return the updated document
    );
    if (updatedStudent) return updatedStudent;
  
    // Update instructor model
    const updatedInstructor = await this.instructorModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    );
    if (updatedInstructor) return updatedInstructor;
  
    // Update admin model
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    );
    if (updatedAdmin) return updatedAdmin;
  
    // Throw if no matching user is found
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  

  async remove(id: string): Promise<UserDocument> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
    if (deletedStudent) return deletedStudent;
    const deletedInstructor = await this.instructorModel.findByIdAndDelete(id).exec();
    if (deletedInstructor) return deletedInstructor;
    else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }


  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(userId);

      if (updateProfileDto.password) {
        updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10);
      }

      Object.assign(user, updateProfileDto);
      return await user.save();
    } catch (error) {
      throw new NotFoundException('User not found');

    }
  }


async getEnrolledCourses(userId: string): Promise<Course[]> {
  // Fetch the student by ID, and populate the enrolledCourses field
  const student = await this.studentModel
    .findById(userId)
    .populate<{ enrolledCourses: Course[] }>('enrolledCourses') 
    .exec();

  if (!student) {
    throw new NotFoundException(`Student with id ${userId} not found`);
  }

  // Return the populated courses (enrolledCourses is now of type Course[])
  return student.enrolledCourses; 
}

  async getCompletedCourses(userId: string) {
    try {
      const user = await this.studentModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('Student not found');
      }

      return user.completedCourses;

    } catch (error) {
      throw new NotFoundException('Student not found');

    }
  }

  async getCoursesTaught(userId: string) {
    try {
      const user = await this.instructorModel.findById(userId)
        .populate('coursesTaught')
        .exec();
      return user?.coursesTaught || [];
    } catch (error) {
      throw new NotFoundException('Instructor not found');
    }
  }
  async enrollCourse(userId: string, courseId: string) {
    console.log(userId, courseId);
    const student = await this.studentModel.findById(userId);
    const course = await this.courseModel.findById(courseId);
    const progress = await this.progressModel.create({ userId: student._id, courseId: course._id, 0 : Number});
  
    if (!student || !course) {
      throw new NotFoundException('Student or course not found');
    }
  
    // Check if the student is already enrolled
    if (student.enrolledCourses.map(id => id.toString()).includes(course._id.toString())) {
      throw new ConflictException('Student already enrolled in this course');
    }
  
    // Add student to course's students array
    course.students.push(student._id as any);
    await course.save(); // Ensure changes to the course are saved
  
    // Add course to student's enrolled courses
    student.enrolledCourses.push(course._id as any);
    await student.save(); // Ensure changes to the student are saved
  
    return student.populate('enrolledCourses');
  }
  

  async hasRole(userId: string, role: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user.role == 'admin') {
      throw new ConflictException('Admins cannot enter chat');
    }
    return user && user.role === role.toLowerCase();
  }

  //get notifications
  async getNotifications(userId: string) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user.notifications);
    return user.notifications;
  }
}