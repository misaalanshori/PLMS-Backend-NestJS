import { PartialType } from '@nestjs/mapped-types';
import { CreateShelfDto } from './createShelf.dto';

export class UpdateShelfDto extends PartialType(CreateShelfDto) {}
