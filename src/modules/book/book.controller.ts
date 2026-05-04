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
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.getBook(id);
  }

  @Get()
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Post()
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Patch(':id')
  updateBook(
    @Body() dto: UpdateBookDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookService.updateBook(dto, id);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.deleteBook(id);
  }
}
