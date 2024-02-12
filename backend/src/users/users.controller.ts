import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PasswordUserInterceptor } from 'src/interceptors/password-user.interceptor';
import { PasswordWishInterceptor } from 'src/interceptors/password-wish.interceptor';
import { InvalidDataExceptionFilter } from 'src/filter/invalid-data-exception.filter';
import { UserProfileResponseDto } from './dto/response/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/response/user-publick-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserWishesDto } from './dto/user-wishes.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(PasswordUserInterceptor)
  @Get('me')
  async findCurrentUser(
    @Request() { user: { id } },
  ): Promise<UserProfileResponseDto> {
    return await this.usersService.findById(id);
  }

  @UseInterceptors(PasswordWishInterceptor)
  @Get('me/wishes')
  async findCurrentUserWishes(@Request() { user: { id } }): Promise<Wish[]> {
    const relations = ['wishes', 'wishes.owner', 'wishes.offers'];
    return await this.usersService.findWishes(id, relations);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @Post('find')
  async searchUser(
    @Body() { query }: FindUserDto,
  ): Promise<UserProfileResponseDto[]> {
    return await this.usersService.search(query);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @Get(':username')
  async findUser(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return await this.usersService.findByUsername(username);
  }

  @UseInterceptors(PasswordWishInterceptor)
  @Get(':username/wishes')
  async findUserWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const { id } = await this.usersService.findByUsername(username);
    const relations = ['wishes', 'wishes.owner', 'wishes.offers'];
    return await this.usersService.findWishes(id, relations);
  }

  @Patch('me')
  @UseFilters(InvalidDataExceptionFilter)
  @UseInterceptors(PasswordUserInterceptor)
  async updateCurrentUser(
    @Request() { user: { id } },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }
}
