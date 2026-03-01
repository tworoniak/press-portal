import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [PrismaModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
