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
import { env } from 'process';

@Module({
  imports: [MongooseModule.forRoot(env.MONGO_URI),
       UserModule, AnalyticsModule,  NotesModule, ProgressModule,  ResponsesModule, ModulesModule, CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
