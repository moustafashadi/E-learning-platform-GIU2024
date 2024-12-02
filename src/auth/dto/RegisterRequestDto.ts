import { Course } from "../../course/models/course.schema";

export class RegisterRequestDto {
    email: string;
    name: string;
    age: Number;
    courses: Course[] = [];
    password: string;
    roles: string[] = ["student"];
}