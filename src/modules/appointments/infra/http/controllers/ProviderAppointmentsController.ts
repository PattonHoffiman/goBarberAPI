import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProvidersController {
  async index(req: Request, res: Response): Promise<Response> {
    const { month, year, day } = req.body;
    const provider_id = req.user.id;
    const listProviderAppointments = container.resolve(ListProviderAppointmentsService);
    const appointments = await listProviderAppointments.execute({
      provider_id,
      month,
      year,
      day,
    });
    return res.json(appointments);
  }
}
