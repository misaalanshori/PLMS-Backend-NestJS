import { Exclude, Expose } from 'class-transformer';

export class TagResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<TagResponseDto>) {
    Object.assign(this, partial);
  }
}
