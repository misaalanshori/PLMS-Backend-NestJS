import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class BookImageDto {
  @IsInt()
  @IsNotEmpty()
  @Expose()
  order: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @Expose()
  publicId: string;

  @Expose()
  @IsOptional()
  url?: string;

  // Constructor to be able to instantiate the object
  constructor(partial: Partial<BookImageDto>) {
    Object.assign(this, partial);
  }
}
