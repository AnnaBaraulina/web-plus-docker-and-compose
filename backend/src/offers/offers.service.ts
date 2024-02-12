import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { ErrorCode } from 'src/exeptions/error-codes';
import { ServerException } from 'src/exeptions/server.exeptions';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const item = await this.wishesService.findById(createOfferDto.itemId);
      if (userId === item.owner.id) {
        throw new ForbiddenException('Можно поддержать только чужие подарки');
      }

      const user = await this.usersService.findById(item.owner.id);
      const totalRaised = Number(
        (item.raised + createOfferDto.amount).toFixed(2),
      );

      if (totalRaised > item.price) {
        throw new ServerException(ErrorCode.RaisedForbidden);
      }

      await this.wishesService.raisedUpdate(createOfferDto.itemId, {
        raised: totalRaised,
      });

      const offer = await this.offerRepository.save({
        ...createOfferDto,
        item,
        user,
      });
      await queryRunner.commitTransaction();
      delete item.owner.password;
      delete user.password;
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
