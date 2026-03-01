import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContactCreateInput) {
    return this.prisma.contact.create({ data });
  }

  async findAll(filters?: {
    search?: string;
    status?: string;
    tag?: string;
    needsFollowUp?: boolean;
  }) {
    const search = filters?.search?.trim();
    const status = filters?.status?.trim();
    const tag = filters?.tag?.trim();

    const now = new Date();

    return this.prisma.contact.findMany({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...(status ? { status: status as any } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { displayName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(filters?.needsFollowUp
          ? {
              interactions: {
                some: { nextFollowUpAt: { lte: now } },
              },
            }
          : {}),
      },
      include: {
        interactions: {
          where: { nextFollowUpAt: { not: null } },
          orderBy: { nextFollowUpAt: 'asc' },
          take: 1,
          select: {
            id: true,
            nextFollowUpAt: true,
          },
        },
      },
      orderBy: [{ lastContactedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        interactions: {
          orderBy: { occurredAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ContactUpdateInput) {
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
