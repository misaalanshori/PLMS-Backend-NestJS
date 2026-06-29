import { Expose } from 'class-transformer';

export class ShelfResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Constructor to be able to instantiate the object
  constructor(partial: Partial<ShelfResponseDto>) {
    Object.assign(this, partial);
  }
}
