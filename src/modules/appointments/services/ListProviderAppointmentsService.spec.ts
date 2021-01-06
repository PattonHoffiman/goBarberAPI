import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 12, 8, 0, 0),
      provider_id: 'provider',
      user_id: 'user-id-1'
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 12, 9, 0, 0),
      provider_id: 'provider',
      user_id: 'user-id-2'
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 12
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
