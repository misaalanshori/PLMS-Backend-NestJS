import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { MediaAssetModule } from '../media-asset/media-asset.module';

@Module({
  imports: [PrismaModule, MediaAssetModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
