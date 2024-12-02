import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([//registering the user schema with mongoose
      { name: 'User', schema: UserSchema },
      { name: 'Admin', schema: UserSchema },
      { name: 'Instructor', schema: UserSchema },
      { name: 'Student', schema: UserSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
