import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { responseSchema } from './models/response.schema';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: responseSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class ResponsesModule {}
