import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const { name, email, avatar_id } = req.body;

    const emailExists = await Deliveryman.findOne({
      where: { email },
    });

    if (emailExists) {
      return res
        .status('400')
        .json({ error: 'Email de entregador já cadastrado' });
    }

    const deliveryman = await Deliveryman.create({
      name,
      email,
      avatar_id,
    });

    return res.json(deliveryman);
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });
    return res.json(deliverymans);
  }
}

export default new DeliverymanController();
