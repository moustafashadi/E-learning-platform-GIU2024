import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Instructor, Student, User, UserDocument } from 'src/user/models/user.schema';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs-stream';
import { Readable } from 'stream';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Quiz } from 'src/quiz/models/quiz.schema';
import { QuizService } from 'src/quiz/services/quiz.service';
import { Request } from 'express';


@Injectable()
export class CourseService {
  constructor(
    //quiz service
    private quizService: QuizService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
    @InjectModel(Quiz.name) private quizModal: Model<Quiz>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) { }

  static get storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        // Define the 'uploads' folder in the project root
        const uploadPath = path.join(__dirname, '../../../uploads'); // Ensures the uploads folder exists
        fs.mkdirSync(uploadPath, { recursive: true });  // Create the uploads folder if it doesn't exist
        cb(null, uploadPath);  // Set the destination folder
      },
      filename: (req, file, cb) => {
        // Generate a unique filename using original name and timestamp for uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${file.originalname}`;
        console.log('Generated filename:', fileName);
        cb(null, fileName);  // Use the original file name, or modify as needed
      },
    });
  }
  
 
  // Upload Resource Method
  async uploadResource(courseId: string, file: Express.Multer.File): Promise<Course> {
    console.log('File received:', file);

    // Ensure that file is provided
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Ensure the filename is set properly
    if (!file.filename) {
      throw new BadRequestException('File is missing or filename not set properly');
    }

    console.log('File upload initiated:', file);

    // Find the course by course ID
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Save the file metadata to the course
    const filePath = `/uploads/${file.filename}`;  // Relative path from the public directory
    course.resources.push(filePath);

    // Save the course after updating resources
    await course.save();
    console.log('Resource added to course:', filePath);
    
    return course;
  }

  
  // Get Resource Method
  async getResource(courseId: string, fileName: string): Promise<fs.ReadStream> {
    // Find the course by course ID
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if the file exists in the course resources
    const filePath = `/uploads/${fileName}`;
    if (!course.resources.includes(filePath)) {
      throw new NotFoundException(`File not found in course resources: ${fileName}`);
    }

    // Construct the file path to the 'uploads' directory in your server
    const fullPath = path.join(__dirname, '../../../uploads', fileName);

    // Check if the file exists in the filesystem
    if (!fs.existsSync(fullPath)) {
      // If the file doesn't exist, throw a NotFoundException
      throw new NotFoundException(`File not found: ${fileName}`);
    }

    // Return the file stream if the file exists
    return fs.createReadStream(fullPath);
  }
  //get enrolled students
  async getEnrolledStudents(course_id: string): Promise<mongoose.ObjectId[]> {
    const course = await this.courseModel.findById(course_id).populate('students').exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
    return course.students;
  }

  async create(@Req() req : Request, {course_code, title, description, numberofQuizzes, category, difficulty }): Promise<Course> {
    try {
      const course = new this.courseModel({
        course_code: course_code,
        title,
        description,
        numOfQuizzes: numberofQuizzes,
        category,
        difficulty,
        instructor: req.user['sub'],
      });
      //update the instructor's courses taught
      
      const instructor = await this.instructorModel.findById(course.instructor);
      instructor.coursesTaught.push(course._id as unknown as mongoose.ObjectId);
      await instructor.save();
      return await course.save();
    } catch (error) {
      throw new BadRequestException('Invalid course data');
    }
  }

  async findAll(): Promise<Course[]> {
    return await this.courseModel.find().populate('instructor').exec();
  }

  async findOne(course_id: string): Promise<Course> {
    const course = await this.courseModel.findById(course_id).populate('instructor').exec();

    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }

    return course;
  }

  async update(req: Request, courseId: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Update the course fields
    course.title = updateCourseDto.title;
    course.description = updateCourseDto.description;
    course.category = updateCourseDto.category;
    course.difficulty = updateCourseDto.difficulty;
    course.numOfQuizzes = updateCourseDto.numOfQuizzes;

    return await course.save();
  }

  async delete(id: string): Promise<void> {
    try {
      const course = await this.courseModel.findById(id).exec();
      //remove course from instructor's courses taught
      const instructor = await this.instructorModel.findById(course.instructor);
      instructor.coursesTaught = instructor.coursesTaught.filter(courseId => courseId.toString() !== id);
      await instructor.save();

      //remove course from students' enrolled courses
      const students = await this.getEnrolledStudents(id);
      students.forEach(async (studentId) => {
        const student = await this.studentModel.findById(studentId);
        student.enrolledCourses = student.enrolledCourses.filter(courseId => courseId.toString() !== id);
        await student.save();
      });
      
      //delete all quizzes in this course
      const quizzes = course.quizzes;
      await this.quizService.deleteQuizzes(quizzes);
      const result = await this.courseModel.findByIdAndDelete(id).exec();
      console.log(result);
      if (!result) {
        throw new NotFoundException(`Course with code ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting course');
    }
  }

  async searchCoursesByCategory(category: string): Promise<Course[]> {
    return await this.courseModel.find({ category }).exec();
  }

  async searchCoursesByDifficulty(difficulty: string): Promise<Course[]> {
    return await this.courseModel.find({ difficulty }).exec();
  }

  async findCoursesByInstructor(instructorId: string): Promise<Course[]> {
    // Find the instructor by their ID and populate the 'coursesTaught' field
    const instructor = await this.instructorModel.findById(instructorId).exec();
  
    if (!instructor || instructor.role !== 'instructor') {
      throw new NotFoundException(`Instructor with ID ${instructorId} not found or invalid role`);
    }
  
    // Fetch the list of courses taught by the instructor
    const courseIds = instructor.coursesTaught;
    
    if (!courseIds || courseIds.length === 0) {
      throw new NotFoundException(`No courses found for instructor with ID ${instructorId}`);
    }
  
    // Now find the courses using the list of courseIds
    const courses = await this.courseModel.find({
      _id: { $in: courseIds },
    }).exec();
  
    if (!courses || courses.length === 0) {
      throw new NotFoundException(`No courses found for instructor with ID ${instructorId}`);
    }
  
    return courses;
  }
  
  //GET COURSE QUIZZES
  async getCourseQuizzes(courseId: string): Promise<Quiz[]> {
    const course = await this.courseModel.findById(courseId).populate('quizzes').exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const quizIds = course.quizzes; 
    const quizzes = await this.quizModal.find({ _id: { $in: quizIds } }).exec();
    return quizzes;
  }

  

}