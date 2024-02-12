import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';
import { SigninUserResponseDto } from 'src/users/dto/response/signin-user-response.dto';
import { SignupUserResponseDto } from 'src/users/dto/response/signup-user-response.dto';
import { ErrorCode } from 'src/exeptions/error-codes';
import { ServerException } from 'src/exeptions/server.exeptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async auth(user: User): Promise<SigninUserResponseDto> {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<SignupUserResponseDto> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.LoginOrPasswordIncorrect);
    }

    const isValid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new ServerException(ErrorCode.LoginOrPasswordIncorrect);
    } else {
      const { password, ...result } = user;
      return result;
    }
  }
}
