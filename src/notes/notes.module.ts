import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesSchema } from './models/notes.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Notes', schema: NotesSchema }]) 
      ],
      controllers: [], 
      providers: [], 
})
export class NotesModule {}
