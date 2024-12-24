import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './models/module.schema';
import { ModuleController } from './controllers/module.controller';
import { ModuleService } from './services/module.service';
import { JwtModule } from '@nestjs/jwt';
import { CourseModule } from 'src/course/course.module';
import { ResourceModule } from 'src/resources/resource.module'; // Import ResourceModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    CourseModule,
    ResourceModule, // Import ResourceModule to make ResourceModel available
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModulesModule {}