import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

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

  async update(id: string, dto: UpdateInteractionDto) {
    return this.prisma.interaction.update({
      where: { id },
      data: {
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.subject !== undefined ? { subject: dto.subject } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
        ...(dto.outcome !== undefined ? { outcome: dto.outcome } : {}),
        ...(dto.occurredAt !== undefined
          ? {
              occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
            }
          : {}),
        ...(dto.nextFollowUpAt !== undefined
          ? {
              nextFollowUpAt: dto.nextFollowUpAt
                ? new Date(dto.nextFollowUpAt)
                : null,
            }
          : {}),
        ...(dto.bandId !== undefined
          ? dto.bandId
            ? { band: { connect: { id: dto.bandId } } }
            : { band: { disconnect: true } }
          : {}),
        ...(dto.festivalId !== undefined
          ? dto.festivalId
            ? { festival: { connect: { id: dto.festivalId } } }
            : { festival: { disconnect: true } }
          : {}),
      },
      include: {
        band: { select: { id: true, name: true } },
        festival: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.interaction.delete({
      where: { id },
      select: { id: true, contactId: true },
    });
  }
}
