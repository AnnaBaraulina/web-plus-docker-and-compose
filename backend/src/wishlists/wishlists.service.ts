import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ErrorCode } from 'src/exeptions/error-codes';
import { ServerException } from 'src/exeptions/server.exeptions';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}
  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { itemsId, ...rest } = createWishlistDto;

      const items = await this.wishesService.getWishListByIds(itemsId);
      const owner = await this.usersService.findById(userId);

      const wishList = await this.wishlistRepository.save({
        ...rest,
        items,
        owner,
      });
      await queryRunner.commitTransaction();
      return wishList;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const wishlists = await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });

    if (!wishlists) {
      throw new ServerException(ErrorCode.WishlistsNotFound);
    }

    return wishlists;
  }

  async findById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistsNotFound);
    }

    return wishlist;
  }

  async delete(userId: number, wishListId: number) {
    const wishlist = await this.findById(wishListId);

    if (userId !== wishlist.owner.id) {
      throw new ServerException(ErrorCode.DeleteForbidden);
    }

    return await this.wishlistRepository.delete(wishListId);
  }
}
