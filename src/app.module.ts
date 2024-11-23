import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { QuickNotesModule } from './notes/quick-notes.module';
import { ProgressModule } from './progress/progress.module';
import { ResponsesModule } from './response/response.module';
import { ModulesModule } from './module/module.module';
import { CommunicationModule } from './communication/communication.module';


@Module({
  imports: [UserModule, AnalyticsModule,  QuickNotesModule, ProgressModule,  ResponsesModule, ModulesModule, CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
