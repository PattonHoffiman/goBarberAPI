import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListAllProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const listAllAppointments = container.resolve(ListAllProvidersService);
    const providers = await listAllAppointments.execute({ user_id });
    return res.json(providers);
  }
}
