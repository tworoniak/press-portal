/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  contactId!: string;

  @IsIn(['EMAIL', 'CALL', 'DM', 'NOTE', 'TEXT', 'MEETING'])
  type!: string;

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
}
