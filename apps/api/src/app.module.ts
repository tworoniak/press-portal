import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InteractionsModule } from './interactions/interactions.module';
import { BandsModule } from './bands/bands.module';
import { FestivalsModule } from './festivals/festivals.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ContactsModule,
    DashboardModule,
    InteractionsModule,
    BandsModule,
    FestivalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
