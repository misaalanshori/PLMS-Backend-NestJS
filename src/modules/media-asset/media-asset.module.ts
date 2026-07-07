import { Module } from '@nestjs/common';
import { MediaAssetController } from './media-asset.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { MediaAssetService } from './media-asset.service';

@Module({
  imports: [PrismaModule],
  controllers: [MediaAssetController],
  providers: [MediaAssetService],
  exports: [MediaAssetService],
})
export class MediaAssetModule {}
