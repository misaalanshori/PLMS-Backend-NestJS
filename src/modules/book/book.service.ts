import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Book } from 'src/generated/prisma/client';
import { CreateBookDto } from './dto/createBook.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  getBook(id: number): Promise<Book | null> {
    const book = this.prisma.book.findFirst({ where: { id } });
    return book;
  }

  getAllBooks(): Promise<Book[]> {
    const books = this.prisma.book.findMany();
    return books;
  }

  createBook(dto: CreateBookDto): Promise<Book | null> {
    const book = this.prisma.book.create({ data: dto });
    return book;
  }
}
