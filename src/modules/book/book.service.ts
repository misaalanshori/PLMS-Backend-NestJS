import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { normalizeTag } from 'src/utils/normalizeTag.util';
import { BookResponseDto } from './dto/bookResponse.dto';
import { ShelfResponseDto } from '../shelf/dto/shelfResponse.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  async getBook(id: number): Promise<BookResponseDto | null> {
    const book = await this.prisma.book.findFirstOrThrow({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        shelf: { include: { books: true } },
      },
    });
    return new BookResponseDto({
      ...book,
      tags: book.tags.map((tag) => tag.tag),
      shelf: book.shelf && new ShelfResponseDto({ ...book.shelf }),
    });
  }

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.prisma.book.findMany({
      include: {
        tags: { include: { tag: true } },
        shelf: { include: { books: true } },
      },
    });

    return books.map(
      (book) =>
        new BookResponseDto({
          ...book,
          tags: book.tags.map((tag) => tag.tag),
          shelf: book.shelf && new ShelfResponseDto({ ...book.shelf }),
        }),
    );
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto | null> {
    const { tags, shelfId, ...bookData } = dto;
    const normalizedTags = Array.from(new Set(tags.map(normalizeTag)));
    const book = await this.prisma.book.create({
      data: {
        ...bookData,
        ...(normalizedTags.length > 0 && {
          // Connect Tags: So in human language I think this is
          // "On the tags field in the Book, create a Tag,
          // find it first based on name, if doesn't exist yet then create with name"
          tags: {
            create: normalizedTags.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name: name },
                  create: { name: name },
                },
              },
            })),
          },
        }),
        ...(shelfId ? { shelf: { connect: { id: shelfId } } } : null),
      },
      include: {
        tags: { include: { tag: true } },
        shelf: { include: { books: true } },
      },
    });
    return new BookResponseDto({
      ...book,
      tags: book.tags.map((tag) => tag.tag),
      shelf: book.shelf && new ShelfResponseDto({ ...book.shelf }),
    });
  }

  async updateBook(
    dto: UpdateBookDto,
    id: number,
  ): Promise<BookResponseDto | null> {
    const { tags, shelfId, ...bookData } = dto;
    const normalizedTags = Array.from(new Set(tags?.map(normalizeTag) || []));
    return await this.prisma.$transaction(async () => {
      const bookTags = await this.prisma.bookTag.findMany({
        where: { bookId: id },
      });
      await this.prisma.bookTag.deleteMany({ where: { bookId: id } });
      const book = await this.prisma.book.update({
        data: {
          ...bookData,
          ...(normalizedTags &&
            normalizedTags.length > 0 && {
              // Connect tags
              tags: {
                create: normalizedTags.map((name) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: name },
                      create: { name: name },
                    },
                  },
                })),
              },
            }),
          ...('shelfId' in dto &&
            (shelfId === null
              ? { shelf: { disconnect: true } }
              : { shelf: { connect: { id: shelfId } } })),
        },
        where: { id },
        include: {
          tags: { include: { tag: true } },
          shelf: { include: { books: true } },
        },
      });

      // Unused Tag deletion logic
      if (bookTags.length > 0) {
        const oldTagIds = bookTags.map((bookTag) => bookTag.tagId);

        // I think in human language this means
        // "Delete all the tags whose id is in oldTagIds and has no relationship with any book"
        // Probably better than the previous approach of querying the oldTagIds against bookTag
        // again and then deleting the ones that was gone
        await this.prisma.tag.deleteMany({
          where: {
            id: {
              in: oldTagIds,
            },
            books: { none: {} },
          },
        });
      }

      return new BookResponseDto({
        ...book,
        tags: book.tags.map((tag) => tag.tag),
        shelf: book.shelf && new ShelfResponseDto({ ...book.shelf }),
      });
    });
  }

  async deleteBook(id: number): Promise<BookResponseDto | null> {
    return await this.prisma.$transaction(async () => {
      const bookTags = await this.prisma.bookTag.findMany({
        where: { bookId: id },
      });
      const book = await this.prisma.book.delete({
        where: { id },
        include: {
          tags: { include: { tag: true } },
          shelf: { include: { books: true } },
        },
      });

      // Unused Tag deletion logic
      if (bookTags.length > 0) {
        const oldTagIds = bookTags.map((bookTag) => bookTag.tagId);

        await this.prisma.tag.deleteMany({
          where: {
            id: {
              in: oldTagIds,
            },
            books: { none: {} },
          },
        });
      }

      return new BookResponseDto({
        ...book,
        tags: book.tags.map((tag) => tag.tag),
        shelf: book.shelf && new ShelfResponseDto({ ...book.shelf }),
      });
    });
  }
}
