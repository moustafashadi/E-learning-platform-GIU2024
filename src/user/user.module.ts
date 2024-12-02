import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([//registering the user schema with mongoose
      
      { name: 'User', schema: UserSchema },//registering the user schema with mongoose
      { name: 'Admin', schema: UserSchema },//registering the admin schema with mongoose
      { name: 'Instructor', schema: UserSchema },//registering the instructor schema with mongoose
      { name: 'Student', schema: UserSchema },//registering the student schema with mongoose

    ]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
