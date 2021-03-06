import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import DeliveryCancelMail from '../jobs/DeliveryCancelMail';

class DeliveryProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Preenchimento incorreto de campos!' });
    }

    const { id } = req.params;

    const deliveryExists = await Delivery.findByPk(id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Id de entrega inexistente!' });
    }

    const { description } = req.body;

    const updated = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(updated);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliveryExists = await Delivery.findByPk(id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Id de entrega inexistente!' });
    }

    const deliveries = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryExists.id },
    });

    if (!deliveries) {
      return res
        .status(400)
        .json({ error: 'Não existem problemas com essa entrega!' });
    }

    return res.json(deliveries);
  }

  async delete(req, res) {
    const problemId = req.params.id;

    const problem = await DeliveryProblem.findByPk(problemId);

    if (!problem) {
      return res.status(400).json({ error: 'Id de problema inexistente!' });
    }

    const DeliveryId = problem.delivery_id;

    const delivery = await Delivery.findByPk(DeliveryId);

    const canceled_at = new Date();

    const canceled = await delivery.update({
      canceled_at,
      status: 'CANCELADO',
    });

    const { deliveryman_id } = delivery;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    await Queue.add(DeliveryCancelMail.key, {
      delivery,
      deliveryman,
      problem,
    });

    return res.json(canceled);
  }
}

export default new DeliveryProblemController();
