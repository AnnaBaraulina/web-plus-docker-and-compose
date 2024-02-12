import { IsString, IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @IsNotEmpty()
  @IsString()
  query: string;
}
