import { faker } from '@faker-js/faker';
import moment from 'moment';
import mongoose from 'mongoose';
import config from '../../config/config';
import { NewToken } from './token.interfaces';
import Token from './token.model';
import * as tokenService from './token.service';
import tokenTypes from './token.types';

const password = 'password1';
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);

describe('Token Model', () => {
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  let newToken: NewToken;
  beforeEach(() => {
    newToken = {
      token: userOneAccessToken,
      user: userOne._id.toHexString(),
      type: tokenTypes.REFRESH,
      expires: refreshTokenExpires.toDate(),
    };
  });

  test('should correctly validate a valid token', async () => {
    await expect(new Token(newToken).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if type is unknown', async () => {
    newToken.type = 'invalidType';
    await expect(new Token(newToken).validate()).rejects.toThrow();
  });
});
