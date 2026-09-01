import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
