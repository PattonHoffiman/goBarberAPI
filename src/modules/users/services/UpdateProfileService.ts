import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  user_id: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) throw new AppError('User Not Found.');

    const existentUserEmail = await this.usersRepository.findByEmail(email);

    if(existentUserEmail && existentUserEmail.id !== user_id) throw new AppError('E-mail Already In Use');

    user.name = name;
    user.email = email;

    if(password && !old_password) {
      throw new AppError('You need to inform the old password to set a new password');
    } else if(password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if(!checkOldPassword) throw new AppError('Old Password does not Match');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
