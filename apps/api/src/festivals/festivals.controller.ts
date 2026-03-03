import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FestivalsService } from './festivals.service';

@UseGuards(JwtAuthGuard)
@Controller('festivals')
export class FestivalsController {
  constructor(private readonly festivals: FestivalsService) {}

  @Post()
  create(@Body() body: Prisma.FestivalCreateInput) {
    return this.festivals.create(body);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.festivals.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivals.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Prisma.FestivalUpdateInput) {
    return this.festivals.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivals.remove(id);
  }

  // ✅ Step B: link / unlink contacts
  @Post(':id/contacts')
  addContact(
    @Param('id') festivalId: string,
    @Body()
    body: {
      contactId: string;
      relationshipRole?: string;
      relationshipNotes?: string;
    },
  ) {
    return this.festivals.addContact(festivalId, body);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(
    @Param('id') festivalId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.festivals.removeContact(festivalId, contactId);
  }
}
