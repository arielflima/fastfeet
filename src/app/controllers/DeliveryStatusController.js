import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;

    const deliveriesToDeliveryman = await Delivery.findAll({
      where: { deliveryman_id: id },
    });

    const validDeliveries = deliveriesToDeliveryman.filter(
      delivery => !(delivery.end_date !== null || delivery.canceled_at !== null)
    );

    return res.json(validDeliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Dados preenchidos incorretamente!' });
    }

    const { id } = req.params;

    const { start_date, end_date, signature_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json('Id de entrega não exitente!');
    }

    if (!delivery.start_date && end_date) {
      return res.status(400).json({
        error: 'Antes de informar data de entrega, informe a data de retirada!',
      });
    }

    if (start_date && !delivery.start_date && !end_date && !signature_id) {
      const deliveryCheckIn = await delivery.update({
        start_date,
      });

      return res.json(deliveryCheckIn);
    }

    if (delivery.start_date && end_date && !signature_id) {
      return res.status(400).json({
        error:
          'Para realizar o CheckOut da entrega é necessario enviar assinatura do destinatario!',
      });
    }

    if (!(await File.findByPk(signature_id))) {
      return res.status(400).json({ error: 'Id de assinatura não existe!' });
    }

    const deliveryCheckOut = await delivery.update({
      end_date,
      signature_id,
    });

    return res.json(deliveryCheckOut);
  }
}

export default new DeliveryStatusController();
