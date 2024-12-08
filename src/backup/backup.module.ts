import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupService } from './service/backup.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      // No models needed for backup functionality since we're using mongodump/mongorestore directly
    ])
  ],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {} 