import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserResponseDto } from 'src/users/dto/response/signin-user-response.dto';
import { SignupUserResponseDto } from 'src/users/dto/response/signup-user-response.dto';
import { LocalGuard } from './guards/local.guard';
import { PasswordUserInterceptor } from 'src/interceptors/password-user.interceptor';
import { InvalidDataExceptionFilter } from 'src/filter/invalid-data-exception.filter';

@UseFilters(InvalidDataExceptionFilter)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Request() { user }): Promise<SigninUserResponseDto> {
    return this.authService.auth(user);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
