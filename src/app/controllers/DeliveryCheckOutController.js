import * as Yup from 'yup';
import isAfter from 'date-fns/isAfter';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryCheckOutController {
  async store(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date(),
      signature_id: Yup.number(),
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

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'Impossivel realizar checkOut, entrega sem checkIn' });
    }

    const { end_date, signature_id } = req.body;

    const signatureExists = await File.findByPk(signature_id);

    if (!signatureExists) {
      return res.status(400).json({ error: 'Id de assinatura inexistente!' });
    }

    if (!isAfter(delivery.start_date, end_date)) {
      return res.status(400).json({
        error: 'Data de checkOut deve ser posterior à data de CheckIn',
      });
    }
  }
}

export default new DeliveryCheckOutController();
