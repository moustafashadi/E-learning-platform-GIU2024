import { IsString, IsNotEmpty } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}