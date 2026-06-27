import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configservice: ConfigService) => ({
                uri: configservice.get('MONGODB_URL')
            }),
            inject: [ConfigService]
        })
    ],
})
export class DatabaseModule { }
