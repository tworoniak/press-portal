import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InteractionsController],
  providers: [InteractionsService, PrismaService],
})
export class InteractionsModule {}
