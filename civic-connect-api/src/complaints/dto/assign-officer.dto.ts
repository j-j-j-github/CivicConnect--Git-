import { IsString, IsOptional } from 'class-validator';

export class AssignOfficerDto {
  @IsString()
  @IsOptional()
  officer_id?: string;
}
