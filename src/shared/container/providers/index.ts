import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './MailProvider/models/IMailProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';

import SESMailProvider from './MailProvider/implementations/SESMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStoragedProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';


container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
  );

  container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal'
  ? container.resolve(EtherealMailProvider)
  : container.resolve(SESMailProvider),
);
