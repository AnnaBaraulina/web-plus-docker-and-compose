import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UpdateError = 400,
  SaveError = 400,
  DeleteForbidden = 403,
  LoginOrPasswordIncorrect = 401,
  UserNotFound = 404,
  WishlistNotFound = 404,
  WishlistsNotFound = 404,
  WishesNotFound = 404,
  WishNotFound = 404,
  UserAlreadyExists = 409,
  OfferForbidden = 403,
  RaisedForbidden = 403,
  Forbidden = 403,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Некорректная пара логин и пароль'],
  [
    ErrorCode.UserAlreadyExists,
    'Пользователь с таким email или username уже зарегистрирован',
  ],
  [ErrorCode.UserNotFound, 'Пользователь не найден'],
  [ErrorCode.WishesNotFound, 'Подарки не найдены'],
  [ErrorCode.WishNotFound, 'Подарок не найден'],
  [ErrorCode.WishlistNotFound, 'Список подарков не найдены'],
  [ErrorCode.WishlistsNotFound, 'Списки подарков не найдены'],
  [ErrorCode.UpdateError, 'Ошибка обновления переданных значений'],
  [ErrorCode.SaveError, 'Ошибка сохранения переданных значений'],
  [ErrorCode.DeleteForbidden, 'Можно удалять только свои списки подарков'],
  [ErrorCode.Forbidden, 'Можно удалять только свои подарки'],
  [ErrorCode.OfferForbidden, 'Можно поддержать только чужие подарки'],
  [ErrorCode.RaisedForbidden, 'Слишком большая сумма поддержки'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.UNAUTHORIZED],
  [ErrorCode.UserAlreadyExists, HttpStatus.CONFLICT],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishesNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistsNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.UpdateError, HttpStatus.BAD_REQUEST],
  [ErrorCode.SaveError, HttpStatus.BAD_REQUEST],
  [ErrorCode.RaisedForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.Forbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.OfferForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.DeleteForbidden, HttpStatus.FORBIDDEN],
]);
