import * as Yup from 'yup';
import isToday from 'date-fns/isToday';
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

    const updated = await delivery.update({
      start_date,
    });

    return res.json(updated);
  }
}

export default new DeliveryCheckInController();
