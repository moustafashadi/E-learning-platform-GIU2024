import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from '../communication/models/chat.schema'
import { ForumSchema } from '../communication/models/forum.schema'
import { NotificationSchema } from '../communication/models/notification.schema'

@Module({
    
    imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
              MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }]),
              MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),],

    controllers: [],
    providers: [],
})
    
export class CommunicationModule {}
