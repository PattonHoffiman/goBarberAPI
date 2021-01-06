import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeMailProvider,
      fakeUsersRepository,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'Rockcastle100!@#'
    });

    await sendForgotPasswordEmail.execute({
      email: 'PattonHoffiman@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'PattonHoffiman@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
      const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
      const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

      const user = await fakeUsersRepository.create({
        name: 'Patton Hoffiman',
        email: 'PattonHoffiman@gmail.com',
        password: 'Rockcastle100!@#'
      });

      await sendForgotPasswordEmail.execute({
        email: 'PattonHoffiman@gmail.com',
      });

      expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
