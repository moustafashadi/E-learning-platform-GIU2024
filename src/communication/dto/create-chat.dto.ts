import { IsArray, IsMongoId} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateChatDto {
    @IsArray()
    participants: ObjectId[];

    @IsArray()
    messages: ObjectId[];

    @IsMongoId()
    initializer: ObjectId;
}