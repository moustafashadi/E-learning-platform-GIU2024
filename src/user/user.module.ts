import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema'; 
import { UserDocument } from './models/user.schema'; 


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Instructor', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Student', schema: UserSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
