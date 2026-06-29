import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShelfDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
