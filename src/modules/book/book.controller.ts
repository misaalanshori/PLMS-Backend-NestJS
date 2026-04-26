import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';

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
}
