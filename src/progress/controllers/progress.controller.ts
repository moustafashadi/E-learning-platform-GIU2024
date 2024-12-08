import { Controller, Get, Body, Param, Post, Patch} from '@nestjs/common';
import { ProgressService } from 'src/progress/services/progress.service';

  
  
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':userId/:courseId/initialize')
  async initializeProgress(
  @Param('userId') userId: string,
  @Param('courseId') courseId: string,
) {
  return await this.progressService.initializeProgress(userId, courseId);
}
  // Track or update progress
  @Patch(':userId/:courseId')
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
