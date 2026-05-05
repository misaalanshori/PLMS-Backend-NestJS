import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BookReadingState } from 'src/generated/prisma/enums';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  title: string;

  @IsString()
  @MaxLength(191)
  author: string;

  @IsString()
  description: string;

  @IsString()
  summary: string;

  @IsEnum(BookReadingState)
  readingState: BookReadingState = BookReadingState.UNREAD;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(191, { each: true })
  tags: string[] = [];
}
