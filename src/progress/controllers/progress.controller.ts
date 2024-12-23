import { Controller, Get, Body, Param, Post, Patch} from '@nestjs/common';
import { ProgressService } from 'src/progress/services/progress.service';

  
  
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Get progress of a student in a specific course
  @Get(':userId/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.progressService.getProgress(userId, courseId);
  }

}
