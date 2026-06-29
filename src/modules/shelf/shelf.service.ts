import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ShelfResponseDto } from './dto/shelfResponse.dto';
import { CreateShelfDto } from './dto/createShelf.dto';
import { UpdateShelfDto } from './dto/updateShelf.dto';

@Injectable()
export class ShelfService {
  constructor(private prisma: PrismaService) {}

  async getShelf(id: number): Promise<ShelfResponseDto | null> {
    const shelf = await this.prisma.shelf.findFirstOrThrow({
      where: { id },
    });
    return new ShelfResponseDto({ ...shelf });
  }

  async getAllShelves(): Promise<ShelfResponseDto[]> {
    const shelves = await this.prisma.shelf.findMany();
    return shelves.map((shelf) => new ShelfResponseDto({ ...shelf }));
  }

  async createShelf(dto: CreateShelfDto): Promise<ShelfResponseDto | null> {
    const shelf = await this.prisma.shelf.create({ data: { ...dto } });
    return new ShelfResponseDto({ ...shelf });
  }

  async updateShelf(
    id: number,
    dto: UpdateShelfDto,
  ): Promise<ShelfResponseDto | null> {
    const shelf = await this.prisma.shelf.update({
      where: { id },
      data: { ...dto },
    });
    return new ShelfResponseDto({ ...shelf });
  }

  async deleteShelf(id: number): Promise<ShelfResponseDto | null> {
    const shelf = await this.prisma.shelf.delete({ where: { id } });
    return new ShelfResponseDto({ ...shelf });
  }
}
