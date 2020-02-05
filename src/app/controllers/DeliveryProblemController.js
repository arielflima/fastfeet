import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

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
}

export default new DeliveryProblemController();
