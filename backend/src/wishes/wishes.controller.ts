import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PasswordWishInterceptor } from 'src/interceptors/password-wish.interceptor';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  async getLastWish(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async getTopWish(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(PasswordWishInterceptor)
  @Get(':id')
  async getWishById(
    @Request() { user: { id } },
    @Param('id') wishId: number,
  ): Promise<Wish> {
    return await this.wishesService.findByIdWithOffer(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Request() { user: { id } },
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(id, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(
    @Request() { user: { id } },
    @Param('id') wishId: number,
  ): Promise<Wish> {
    return await this.wishesService.copy(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Request() { user: { id } }, @Param('id') wishId: number) {
    return await this.wishesService.delete(id, wishId);
  }
}
