import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TagModule } from './modules/tag/tag.module';
import { ShelfModule } from './modules/shelf/shelf.module';
import { MediaAssetModule } from './modules/media-asset/media-asset.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BookModule,
    TagModule,
    ShelfModule,
    PrismaModule,
    MediaAssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
