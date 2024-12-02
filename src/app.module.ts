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
import { AuthGuard } from './auth/guards/authentication.guard';
import { authorizationGaurd } from './auth/guards/authorization.guard';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI),
       UserModule, AnalyticsModule,  NotesModule, ProgressModule,  ResponsesModule, ModulesModule, CommunicationModule,
       JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: { expiresIn: process.env.JWT_EXPIRATION },
       })],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: authorizationGaurd,
    }
  ],
})
export class AppModule {}
