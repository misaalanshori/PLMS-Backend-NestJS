import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TagController } from './tag.controller';

@Module({
  imports: [PrismaModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
