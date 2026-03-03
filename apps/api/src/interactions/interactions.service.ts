import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInteractionDto) {
    return this.prisma.interaction.create({
      data: {
        type: dto.type,
        subject: dto.subject,
        notes: dto.notes,
        outcome: dto.outcome,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
        nextFollowUpAt: dto.nextFollowUpAt
          ? new Date(dto.nextFollowUpAt)
          : undefined,

        contact: { connect: { id: dto.contactId } },

        ...(dto.bandId ? { band: { connect: { id: dto.bandId } } } : {}),
        ...(dto.festivalId
          ? { festival: { connect: { id: dto.festivalId } } }
          : {}),
      },
      include: {
        band: { select: { id: true, name: true } },
        festival: { select: { id: true, name: true } },
      },
    });
  }
}
