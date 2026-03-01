import { Body, Controller, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly service: InteractionsService) {}

  @Post()
  create(@Body() dto: CreateInteractionDto) {
    return this.service.create(dto);
  }
}
