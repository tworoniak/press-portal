import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContactCreateInput) {
    return this.prisma.contact.create({ data });
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
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
