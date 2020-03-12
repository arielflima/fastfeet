import * as Yup from 'yup';

import sequelize from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      postalcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro de validação STORE RECIPIENT CONTROLLER' });
    }
    try {
      const nameExists = await Recipient.findOne({
        where: { name: req.body.name },
      });

      if (nameExists) {
        return res
          .status(400)
          .json({ error: 'Nome de destinatário existente!' });
      }

      const recipient = await Recipient.create(req.body);
      return res.json(recipient);
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      postalcode: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro de validação UPDATE RECIPIENT CONTROLLER' });
    }

    const recipientToUpdate = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (!recipientToUpdate) {
      return res
        .status(400)
        .json({ error: 'Nome de destinatário não existe!' });
    }

    const updated = await recipientToUpdate.update(req.body);

    return res.json(updated);
  }

  async index(req, res) {
    const name = req.query.q;

    if (name) {
      const nameFiltered = await Recipient.findAll({
        where: {
          name: {
            [sequelize.Op.like]: `%${name}%`,
          },
        },
      });

      return res.json(nameFiltered);
    }

    const allRecipients = await Recipient.findAll();

    return res.json(allRecipients);
  }
}

export default new RecipientController();
