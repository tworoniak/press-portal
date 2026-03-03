import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BandsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.BandCreateInput) {
    return this.prisma.band.create({ data });
  }

  findAll(search?: string) {
    const q = search?.trim();

    return this.prisma.band.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { genre: { contains: q, mode: 'insensitive' } },
              { country: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { name: 'asc' },
      take: 100,
    });
  }

  async findOne(id: string) {
    return this.prisma.band.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async addContact(
    bandId: string,
    input: {
      contactId: string;
      relationshipRole?: string;
      relationshipNotes?: string;
    },
  ) {
    return this.prisma.contactBand.upsert({
      where: { contactId_bandId: { contactId: input.contactId, bandId } },
      update: {
        relationshipRole: input.relationshipRole,
        relationshipNotes: input.relationshipNotes,
      },
      create: {
        band: { connect: { id: bandId } },
        contact: { connect: { id: input.contactId } },
        relationshipRole: input.relationshipRole,
        relationshipNotes: input.relationshipNotes,
      },
    });
  }

  async removeContact(bandId: string, contactId: string) {
    return this.prisma.contactBand.delete({
      where: { contactId_bandId: { contactId, bandId } },
    });
  }

  update(id: string, data: Prisma.BandUpdateInput) {
    return this.prisma.band.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.band.delete({ where: { id } });
  }
}
