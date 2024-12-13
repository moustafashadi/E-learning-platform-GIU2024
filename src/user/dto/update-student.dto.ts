import { CreateUserDto } from "./create-user.dto";
import { PartialType } from "@nestjs/mapped-types";
import { Types } from "mongoose";

//updateStudentDto
export class updateStudentDto extends PartialType(CreateUserDto) {
    //question mark indicates that the property is optional
    enrolledCourses?: Types.ObjectId[];
    completedCourses?: Types.ObjectId[];
    completedQuizzes?: Types.ObjectId[];
}