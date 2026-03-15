import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async followUpsDue(limit = 20) {
    const now = new Date();

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
    return this.prisma.contact.findMany({
      where: { interactions: { none: {} } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getOverview() {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalContacts,
      totalBands,
      totalFestivals,

      dueCount,
      soonCount,
      scheduledCount,

      followups,
      recentContacts,
      freshContacts,
      recentInteractions,
      upcomingFestivals,
      interactionsLast7DaysRaw,
    ] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.band.count(),
      this.prisma.festival.count(),

      this.prisma.interaction.count({
        where: {
          nextFollowUpAt: { not: null, lte: now },
        },
      }),

      this.prisma.interaction.count({
        where: {
          nextFollowUpAt: {
            gt: now,
            lte: threeDaysFromNow,
          },
        },
      }),

      this.prisma.interaction.count({
        where: {
          nextFollowUpAt: {
            gt: threeDaysFromNow,
          },
        },
      }),

      this.prisma.interaction.findMany({
        where: {
          nextFollowUpAt: { not: null },
        },
        include: {
          contact: {
            select: {
              id: true,
              displayName: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { nextFollowUpAt: 'asc' },
        take: 12,
      }),

      this.prisma.contact.findMany({
        where: { lastContactedAt: { not: null } },
        orderBy: { lastContactedAt: 'desc' },
        take: 8,
      }),

      this.prisma.contact.findMany({
        where: { interactions: { none: {} } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),

      this.prisma.interaction.findMany({
        include: {
          contact: {
            select: {
              id: true,
              displayName: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          band: {
            select: {
              id: true,
              name: true,
            },
          },
          festival: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { occurredAt: 'desc' },
        take: 10,
      }),

      this.prisma.festival.findMany({
        where: {
          startDate: { gte: now },
        },
        orderBy: { startDate: 'asc' },
        take: 8,
        select: {
          id: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
        },
      }),

      this.prisma.interaction.findMany({
        where: {
          occurredAt: { gte: sevenDaysAgo },
        },
        select: {
          occurredAt: true,
        },
      }),
    ]);

    const interactionsLast7Days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);

      const start = new Date(day);
      start.setHours(0, 0, 0, 0);

      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const count = interactionsLast7DaysRaw.filter((it) => {
        const ts = new Date(it.occurredAt).getTime();
        return ts >= start.getTime() && ts <= end.getTime();
      }).length;

      return {
        day: day.toLocaleDateString(undefined, { weekday: 'short' }),
        count,
      };
    });

    const pipeline = [
      { name: 'Due', value: dueCount },
      { name: 'Soon', value: soonCount },
      { name: 'Scheduled', value: scheduledCount },
    ];

    return {
      summary: {
        due: dueCount,
        soon: soonCount,
        scheduled: scheduledCount,
        totalContacts,
        totalBands,
        totalFestivals,
      },
      pipeline,
      interactionsLast7Days,
      followups,
      recentContacts,
      freshContacts,
      recentInteractions,
      upcomingFestivals,
    };
  }
}
