import { Injectable } from '@nestjs/common';
import { TagResponseDto } from './dto/tagResponse.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async getAllTags(): Promise<TagResponseDto[]> {
    const tags = await this.prisma.tag.findMany();
    return tags.map((tag) => new TagResponseDto(tag));
  }
}
