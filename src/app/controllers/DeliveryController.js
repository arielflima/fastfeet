import * as Yup from 'yup';
import Delivery from '../models/Delivery';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.string(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Preenchimento incorreto de campos!' });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = req.body;

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const allDeliveries = await Delivery.findAll();

    return res.json(allDeliveries);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryToDelete = await Delivery.findOne({
      where: { id },
    });

    deliveryToDelete.destroy();

    return res.json(await Delivery.findAll());
  }
}

export default new DeliveryController();
