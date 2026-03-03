import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactions: InteractionsService) {}

  @Post()
  create(@Body() dto: CreateInteractionDto) {
    return this.interactions.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInteractionDto) {
    return this.interactions.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interactions.remove(id);
  }
}
