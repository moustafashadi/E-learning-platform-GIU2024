import { IsMongoId, IsArray} from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuizDto {
    @IsMongoId()
    module_id: Types.ObjectId;

    @IsMongoId()
    course_id: Types.ObjectId;

    @IsArray()
    @IsMongoId({ each: true })
    questions: Types.ObjectId[];
}
