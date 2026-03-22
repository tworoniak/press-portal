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

  @Get()
  overview() {
    return this.dashboard.getOverview();
  }

  @Get('followups')
  followUpsDue(@Query('limit') limit?: string) {
    return this.dashboard.followUpsDue(limit ? Number(limit) : 20);
  }

  @Get('follow-up-queue')
  followUpQueue(@Query('limit') limit?: string) {
    const n = limit ? Number(limit) : 100;
    return this.dashboard.followUpQueue(Number.isFinite(n) ? n : 100);
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
