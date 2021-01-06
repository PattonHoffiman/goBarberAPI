import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeHashProvider,
      fakeUserRepository
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
    });

    expect(updatedUser.name).toBe('Patton Faria');
    expect(updatedUser.email).toBe('PattonFaria@gmail.com');
  });

  it('should not be able to update an non-existing profile', async () => {
    expect(updateProfile.execute({
      user_id: 'non-existent-id',
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const user = await fakeUserRepository.create({
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
      password: 'Batata666FromHell!'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Patton Faria',
      email: 'PattonHoffiman@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
      password: 'Batata999FromHell',
      old_password: 'Batata666FromHell!'
    });

    expect(updatedUser.password).toBe('Batata999FromHell');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
      password: 'Batata999FromHell',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Patton Faria',
      email: 'PattonFaria@gmail.com',
      password: 'Batata999FromHell',
      old_password: 'Batata66FromHell'
    })).rejects.toBeInstanceOf(AppError);
  });
});
