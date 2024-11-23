import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChatModule } from './chat/chat.module';
import { QuickNotesModule } from './quick-notes/quick-notes.module';
import { ForumModule } from './forum/forum.module';
import { ProgressModule } from './progress/progress.module';
import { ResponsessModule } from './responsess/responsess.module';
import { ResponsesModule } from './responses/responses.module';
import { ModulesModule } from './modules/modules.module';
import { CommunicationModule } from './communication/communication.module';

@Module({
  imports: [AdminModule, UserModule, InstructorModule, StudentModule, AnalyticsModule, ChatModule, QuickNotesModule, ForumModule, ProgressModule, ResponsessModule, ResponsesModule, ModulesModule, CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
