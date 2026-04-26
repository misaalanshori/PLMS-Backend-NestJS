import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum BookReadingState {
  UNREAD = 'UNREAD',
  PLAN_TO_READ = 'PLAN_TO_READ',
  READING = 'READING',
  READ = 'READ',
  DROPPED = 'DROPPED',
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  title: string = '';

  @IsString()
  @MaxLength(191)
  author: string = '';

  @IsString()
  description: string = '';

  @IsString()
  summary: string = '';

  @IsEnum(BookReadingState)
  readingState: BookReadingState = BookReadingState.UNREAD;
}
