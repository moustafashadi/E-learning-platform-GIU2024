import { IsNotEmpty, MaxLength, MinLength, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateChatDto {

    @IsMongoId()
    readonly creator: Types.ObjectId;

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    readonly title: string;

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    readonly description: string;
}