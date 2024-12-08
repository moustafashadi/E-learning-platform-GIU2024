import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './models/module.schema';
@Module({
    imports: [
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }])
  ],
  controllers: [], 
  providers: [], 

})
export class ModulesModule {}