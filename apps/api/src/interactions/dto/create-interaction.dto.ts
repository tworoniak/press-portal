import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { InteractionType } from '@prisma/client';

export class CreateInteractionDto {
  @IsString()
  contactId!: string;

  @IsEnum(InteractionType)
  type!: InteractionType;

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
  bandId?: string;

  @IsOptional()
  @IsString()
  festivalId?: string;
}
