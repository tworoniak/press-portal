import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FestivalsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FestivalCreateInput) {
    return this.prisma.festival.create({ data });
  }

  findAll(search?: string) {
    const q = search?.trim();

    return this.prisma.festival.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { location: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { name: 'asc' },
      take: 100,
    });
  }

  findOne(id: string) {
    return this.prisma.festival.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.FestivalUpdateInput) {
    return this.prisma.festival.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.festival.delete({ where: { id } });
  }
}
