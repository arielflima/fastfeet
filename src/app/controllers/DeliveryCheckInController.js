import * as Yup from 'yup';
import sequelize from 'sequelize';
import {
  isToday,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
  parseISO,
} from 'date-fns';
import Delivery from '../models/Delivery';

class DeliveryCheckInController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Dados preenchidos incorretamente!' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Id de entrega inexistente!' });
    }

    if (delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'O checkIn desta entrega já foi feito!' });
    }

    const deliveriesDeliveryman = await Delivery.findAll({
      where: { deliveryman_id: delivery.deliveryman_id },
    });

    const deliveriesToday = deliveriesDeliveryman.filter(
      dlv => !(dlv.start_date === null && !isToday(dlv.start_date))
    );

    if (deliveriesToday.length > 5) {
      return res
        .status(400)
        .json({ error: 'Limite de 5 checkIns por entregador excedido!' });
    }

    const { start_date } = req.body;

    const today = setSeconds(setMinutes(setHours(new Date(), 18), 0), 0);

    if (!isAfter(today, parseISO(start_date))) {
      return res
        .status(400)
        .json({ error: 'O checkIn deve ser realizado antes das 18:00h' });
    }

    const updated = await delivery.update({
      start_date,
      status: 'RETIRADA',
    });

    return res.json(updated);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [sequelize.Op.ne]: null,
        },
      },
    });

    if (deliveries.length < 1) {
      return res
        .status(400)
        .json({ error: 'Nenhuma entrega para esse Id de entregador' });
    }

    return res.json(deliveries);
  }
}

export default new DeliveryCheckInController();
