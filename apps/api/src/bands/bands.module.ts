import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';

@Module({
  imports: [PrismaModule],
  controllers: [BandsController],
  providers: [BandsService],
})
export class BandsModule {}
