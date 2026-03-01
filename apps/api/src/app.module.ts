import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [PrismaModule, ContactsModule, DashboardModule, InteractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
