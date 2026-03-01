import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async followUpsDue(limit = 20) {
    const now = new Date();

    // Find interactions that have followups due and include contact for display
    return this.prisma.interaction.findMany({
      where: {
        nextFollowUpAt: { lte: now },
      },
      include: {
        contact: true,
      },
      orderBy: { nextFollowUpAt: 'asc' },
      take: limit,
    });
  }

  async recentlyContacted(limit = 12) {
    return this.prisma.contact.findMany({
      where: { lastContactedAt: { not: null } },
      orderBy: { lastContactedAt: 'desc' },
      take: limit,
    });
  }

  async notContactedYet(limit = 12) {
    // No interactions logged yet
    return this.prisma.contact.findMany({
      where: { interactions: { none: {} } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
