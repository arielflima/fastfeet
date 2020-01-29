import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const { name, email, avatar_id } = req.body;

    const emailExists = await Deliveryman.findOne({
      where: { email },
    });

    if (emailExists) {
      return res
        .json('400')
        .json({ error: 'Email de entregador já cadastrado' });
    }

    const deliveryman = await Deliveryman.create({
      name,
      email,
      avatar_id,
    });

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
