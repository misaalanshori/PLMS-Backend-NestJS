import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BookReadingState } from 'src/generated/prisma/enums';
import { BookImageDto } from './bookImage.dto';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  title: string;

  @IsString()
  @MaxLength(191)
  author: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  summary: string;

  @IsEnum(BookReadingState)
  @IsOptional()
  readingState: BookReadingState;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(191, { each: true })
  tags: string[] = [];

  @IsNumber()
  @IsOptional()
  shelfId: number | null;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookImageDto)
  images: BookImageDto[] = [];
}
