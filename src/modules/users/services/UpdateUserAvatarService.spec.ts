import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUserRepository
    );
  });

  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non exist user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'noUser',
      avatar_filename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar2.jpg'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
