import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  CanActivate,
  Type,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Prisma } from '@prisma/client';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard as unknown as Type<CanActivate>)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() body: Prisma.ContactCreateInput) {
    return this.contactsService.create(body);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
    @Query('needsFollowUp') needsFollowUp?: string,
  ) {
    return this.contactsService.findAll({
      search,
      status,
      tag,
      needsFollowUp: needsFollowUp === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto as Prisma.ContactUpdateInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Post(':id/bands')
  addBand(@Param('id') id: string, @Body() body: { bandId: string }) {
    return this.contactsService.addBand(id, body.bandId);
  }

  @Delete(':id/bands/:bandId')
  removeBand(@Param('id') id: string, @Param('bandId') bandId: string) {
    return this.contactsService.removeBand(id, bandId);
  }

  @Post(':id/festivals')
  addFestival(@Param('id') id: string, @Body() body: { festivalId: string }) {
    return this.contactsService.addFestival(id, body.festivalId);
  }

  @Delete(':id/festivals/:festivalId')
  removeFestival(
    @Param('id') id: string,
    @Param('festivalId') festivalId: string,
  ) {
    return this.contactsService.removeFestival(id, festivalId);
  }
}
