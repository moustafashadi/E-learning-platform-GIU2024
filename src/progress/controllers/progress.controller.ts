import { Controller, Get, Put, Body, Param} from '@nestjs/common';
import { ProgressService } from 'src/progress/services/progress.service';

  
  
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Track or update progress
  @Put(':userId/:courseId')
  async trackProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() body: { completionPercentage: number },
  ) {
    return await this.progressService.trackProgress(userId, courseId, body.completionPercentage);
  }

  // Get progress of a student in a specific course
  @Get(':userId/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.progressService.getProgress(userId, courseId);
  }

}
