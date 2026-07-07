import { Exclude, Expose, Type } from 'class-transformer';
import { BookReadingState } from 'src/generated/prisma/enums';
import { ShelfResponseDto } from 'src/modules/shelf/dto/shelfResponse.dto';
import { TagResponseDto } from 'src/modules/tag/dto/tagResponse.dto';
import { BookImageDto } from './bookImage.dto';

export class BookResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  author: string;

  @Expose()
  description: string | null;

  @Expose()
  summary: string | null;

  @Expose()
  readingState: BookReadingState;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @Expose()
  @Type(() => ShelfResponseDto)
  shelf: ShelfResponseDto | null;

  @Expose()
  @Type(() => BookImageDto)
  images: BookImageDto[];

  // Constructor to be able to instantiate the object
  constructor(partial: Partial<BookResponseDto>) {
    Object.assign(this, partial);
  }
}
