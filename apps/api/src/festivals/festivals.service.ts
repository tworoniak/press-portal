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

  async findOne(id: string) {
    return this.prisma.festival.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        interactions: {
          orderBy: { occurredAt: 'desc' },
          take: 15,
          include: {
            contact: {
              select: {
                id: true,
                displayName: true,
                firstName: true,
                lastName: true,
                email: true,
                company: true,
                role: true,
              },
            },
            band: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.FestivalUpdateInput) {
    return this.prisma.festival.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.festival.delete({ where: { id } });
  }

  async addContact(
    festivalId: string,
    body: {
      contactId: string;
      relationshipRole?: string;
      relationshipNotes?: string;
    },
  ) {
    return this.prisma.contactFestival.upsert({
      where: {
        contactId_festivalId: {
          contactId: body.contactId,
          festivalId,
        },
      },
      update: {
        relationshipRole: body.relationshipRole ?? null,
        relationshipNotes: body.relationshipNotes ?? null,
      },
      create: {
        festival: { connect: { id: festivalId } },
        contact: { connect: { id: body.contactId } },
        relationshipRole: body.relationshipRole ?? null,
        relationshipNotes: body.relationshipNotes ?? null,
      },
    });
  }

  async removeContact(festivalId: string, contactId: string) {
    return this.prisma.contactFestival.delete({
      where: {
        contactId_festivalId: { contactId, festivalId },
      },
    });
  }
}
