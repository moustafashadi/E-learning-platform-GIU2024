import { Types } from "mongoose";
import { IsNotEmpty } from "class-validator";

export class GetMessagesDto {
  @IsNotEmpty()
  readonly chat: Types.ObjectId;
}
