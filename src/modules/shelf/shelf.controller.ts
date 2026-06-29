import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { CreateShelfDto } from './dto/createShelf.dto';
import { UpdateShelfDto } from './dto/updateShelf.dto';

@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.shelfService.getShelf(id);
  }

  @Get()
  getAllShelves() {
    return this.shelfService.getAllShelves();
  }

  @Post()
  createShelf(@Body() dto: CreateShelfDto) {
    return this.shelfService.createShelf(dto);
  }

  @Patch(':id')
  updateShelf(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShelfDto,
  ) {
    return this.shelfService.updateShelf(id, dto);
  }

  @Delete(':id')
  deleteShelf(@Param('id', ParseIntPipe) id: number) {
    return this.shelfService.deleteShelf(id);
  }
}
