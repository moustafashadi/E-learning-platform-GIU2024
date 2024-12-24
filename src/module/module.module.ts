import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './models/module.schema';
import { ModuleController } from './controllers/module.controller';
import { ModuleService } from './services/module.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
  ],
  controllers: [ModuleController], 
  providers: [ModuleService], 

})
export class ModulesModule {}