import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;

let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    listProviders = new ListProvidersService(
      fakeUserRepository
    );
  });

  it('should be able to list the providers', async () => {
    const provider1 = await fakeUserRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Batata666FromHell!'
    });

    const provider2 = await fakeUserRepository.create({
      name: 'Bruno Melges Faria',
      email: 'BrunoFaria@gmail.com',
      password: 'Batata666FromHell!'
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Ingrid Reichling',
      email: 'IngridReichling@gmail.com',
      password: 'Batata666FromHell!'
    });

    const providers = await listProviders.execute({user_id: loggedUser.id});

    expect(providers).toEqual([provider1, provider2]);
  });
});
