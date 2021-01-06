import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUserRepository;

let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();

    createUser = new CreateUserService(
      fakeHashProvider,
      fakeUserRepository
    );

    authenticateUser = new AuthenticateUserService(
      fakeHashProvider,
      fakeUserRepository
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const response = await authenticateUser.execute({
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    await expect(authenticateUser.execute({
      email: 'PattonHoffiman@gmail.com',
      password: 'Cenoura666FromHell!'
    })).rejects.toBeInstanceOf(AppError);
  });
});
