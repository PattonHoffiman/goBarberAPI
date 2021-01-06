import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;

let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfile = new ShowProfileService(
      fakeUserRepository
    );
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const profile = await showProfile.execute({user_id: user.id});

    expect(profile.name).toBe('Patton Hoffiman');
    expect(profile.email).toBe('PattonHoffiman@gmail.com');
  });

  it('should not be able to show an non-existing profile', async () => {
    expect(showProfile.execute({user_id: 'non-existent-id'})).rejects.toBeInstanceOf(AppError);
  });
});
