import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInteractionDto) {
    const occurredAt = dto.occurredAt ? new Date(dto.occurredAt) : new Date();
    const nextFollowUpAt = dto.nextFollowUpAt
      ? new Date(dto.nextFollowUpAt)
      : null;

    const created = await this.prisma.interaction.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: dto.type as any,
        occurredAt,
        subject: dto.subject ?? null,
        notes: dto.notes ?? null,
        outcome: dto.outcome ?? null,
        nextFollowUpAt,
        contact: { connect: { id: dto.contactId } },
      },
    });

    // Auto-update lastContactedAt when interaction is created
    await this.prisma.contact.update({
      where: { id: dto.contactId },
      data: { lastContactedAt: occurredAt },
    });

    return created;
  }
}
