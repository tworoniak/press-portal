import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { InteractionType } from '@prisma/client';

export class UpdateInteractionDto {
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @IsOptional()
  @IsISO8601()
  occurredAt?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsISO8601()
  nextFollowUpAt?: string;

  @IsOptional()
  @IsString()
  bandId?: string | null;

  @IsOptional()
  @IsString()
  festivalId?: string | null;
}
