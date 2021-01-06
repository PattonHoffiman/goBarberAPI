import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '../entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

export default class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    date,
    user_id,
    provider_id
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async findByDate(
    date: Date
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY' = '${parsedDay}-${parsedMonth}-${year}')`
        )
      },
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY' = '${parsedMonth}-${year}')`
        ),
      },
    });

    return appointments;
  }
}