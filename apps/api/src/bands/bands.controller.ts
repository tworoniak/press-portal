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
import { BandsService } from './bands.service';

@UseGuards(JwtAuthGuard)
@Controller('bands')
export class BandsController {
  constructor(private readonly bands: BandsService) {}

  @Post()
  create(@Body() body: Prisma.BandCreateInput) {
    return this.bands.create(body);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.bands.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bands.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Prisma.BandUpdateInput) {
    return this.bands.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bands.remove(id);
  }
}
