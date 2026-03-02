import {
  CanActivate,
  Controller,
  Get,
  Query,
  Type,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard as unknown as Type<CanActivate>)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('followups')
  followUpsDue(@Query('limit') limit?: string) {
    return this.dashboard.followUpsDue(limit ? Number(limit) : 20);
  }

  @Get('recent')
  recentlyContacted(@Query('limit') limit?: string) {
    return this.dashboard.recentlyContacted(limit ? Number(limit) : 12);
  }

  @Get('new')
  notContactedYet(@Query('limit') limit?: string) {
    return this.dashboard.notContactedYet(limit ? Number(limit) : 12);
  }
}
