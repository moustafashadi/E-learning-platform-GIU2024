import { ObjectId } from "mongoose";
import { IsMongoId, IsArray, IsString } from "class-validator";

export class CreateMessageDto {
    @IsArray()
    chat: ObjectId[];

    @IsString()
    message: string;

    @IsMongoId()
    sender: ObjectId;
}
