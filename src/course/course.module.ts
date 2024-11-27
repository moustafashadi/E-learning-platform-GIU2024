import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './models/course.schema';


@Module({
    imports:[ 
        MongooseModule.forFeature([{ name: 'Course', schema:CourseSchema }])
    ], 
    controllers: [],
    providers: [],
})

export class CourseModule{}