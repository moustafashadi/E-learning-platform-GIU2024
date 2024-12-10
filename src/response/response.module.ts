import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema} from './models/response.schema';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class ResponsesModule {}
