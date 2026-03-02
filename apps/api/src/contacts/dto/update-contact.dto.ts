import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;

  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() role?: string;

  @IsOptional()
  @IsString()
  status?:
    | 'NOT_CONTACTED'
    | 'CONTACTED'
    | 'RESPONDED'
    | 'CONFIRMED'
    | 'PUBLISHED'
    | 'ARCHIVED';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
