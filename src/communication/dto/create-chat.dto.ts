import { IsArray, IsMongoId, IsString} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateChatDto {
    @IsArray()
    participants: ObjectId[];

    @IsArray()
    messages: ObjectId[];

    @IsMongoId()
    creator: ObjectId;

    @IsString()
    title:String;
}