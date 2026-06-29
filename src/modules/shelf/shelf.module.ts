import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ShelfService } from './shelf.service';
import { ShelfController } from './shelf.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ShelfController],
  providers: [ShelfService],
})
export class ShelfModule {}
