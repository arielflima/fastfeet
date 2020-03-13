import * as Yup from 'yup';
import sequelize from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import NewDeliveryMail from '../jobs/NewDeliveryMail';

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

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    await Queue.add(NewDeliveryMail.key, {
      delivery,
      deliveryman,
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const product = req.query.q;

    if (product) {
      const productFiltered = await Delivery.findAll({
        where: {
          product: {
            [sequelize.Op.like]: `%${product}%`,
          },
        },
      });

      return res.json(productFiltered);
    }

    const allDeliveries = await Delivery.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'postalcode',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email', 'avatar_id'],
        },
      ],
    });

    return res.json(allDeliveries);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryToDelete = await Delivery.findByPk(id);

    deliveryToDelete.destroy();

    return res.json(await Delivery.findAll());
  }

  async update(req, res) {
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

    const { id } = req.params;

    const deliveryToUpdate = await Delivery.findByPk(id);

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = req.body;

    deliveryToUpdate.update({
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });

    return res.json(deliveryToUpdate);
  }
}

export default new DeliveryController();
