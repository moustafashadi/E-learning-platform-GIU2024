import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsSchema } from '../analytics/models/analytics.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Analytics', schema: AnalyticsSchema }])],
    controllers: [],
    providers: [],
})
export class AnalyticsModule {}
