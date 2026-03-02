import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FestivalsController } from './festivals.controller';
import { FestivalsService } from './festivals.service';

@Module({
  imports: [PrismaModule],
  controllers: [FestivalsController],
  providers: [FestivalsService],
})
export class FestivalsModule {}
