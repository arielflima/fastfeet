import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os campos não foram preenchidos corretamente! ' });
    }

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos!' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(404)
        .json({ error: 'Id de entregador não encontrado!' });
    }

    const deliverymanExists = await Deliveryman.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path'],
        },
      ],
    });

    const { name, email, avatar_id } = req.body;

    const { avatar } = deliverymanExists;

    const updated = await deliverymanExists.update({
      name,
      email,
      avatar_id,
      avatar,
    });

    return res.json(updated);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.json('Id de entregador não existe!');
    }

    await deliveryman.destroy();

    return res.json(await Deliveryman.findAll());
  }
}

export default new DeliverymanController();
