import { IsString, Length, MinLength, IsNotEmpty } from 'class-validator';

export class SigninUserDto {
  @Length(1, 64)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  password: string;
}
