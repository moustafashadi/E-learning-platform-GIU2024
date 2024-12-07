import { Controller, Get, Put, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getProfile(@Req() req) {
        const userId = req.user.userid;
        const user = await this.userService.findOne(userId);
        
        // Remove sensitive information
        const { password, ...profile } = user.toObject();
        return profile;
    }

    @Get('courses')
    async getCourses(@Req() req) {
        const userId = req.user.userid;
        const user = await this.userService.findOne(userId);

        if (user.role === 'student') {
            return {
                enrolled: await this.userService.getEnrolledCourses(userId),
                completed: await this.userService.getCompletedCourses(userId),
            };
        } else if (user.role === 'instructor') {
            return {
                coursesTaught: await this.userService.getCoursesTaught(userId)
            };
        }

        throw new UnauthorizedException('Invalid role for course information');
    }

    @Put()
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        const userId = req.user.userid;
        return await this.userService.updateProfile(userId, updateProfileDto);
    }
}
