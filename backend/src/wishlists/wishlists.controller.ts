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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { PasswordWishInterceptor } from 'src/interceptors/password-wish.interceptor';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseInterceptors(PasswordWishInterceptor)
  @Get()
  async getAll(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @UseInterceptors(PasswordWishInterceptor)
  @Get(':id')
  async getWishlist(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findById(id);
  }

  @Post()
  async create(
    @Request() { user: { id } },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(id, createWishlistDto);
  }

  @Delete(':id')
  async deleteWishlist(
    @Request() { user: { id } },
    @Param('id') wishListId: number,
  ) {
    return await this.wishlistsService.delete(id, wishListId);
  }
}
