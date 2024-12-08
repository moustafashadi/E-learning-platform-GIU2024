import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotesModule } from './notes/notes.module';
import { ProgressModule } from './progress/progress.module';
import { ResponsesModule } from './response/response.module';
import { ModulesModule } from './module/module.module';
import { CommunicationModule } from './communication/communication.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI),
       UserModule, AnalyticsModule,  NotesModule, ProgressModule,  ResponsesModule, ModulesModule, CommunicationModule, AuthModule,
       CourseModule,
       JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
       })],
  controllers: [AppController],
  providers: [
    AppService,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class AppModule {}
