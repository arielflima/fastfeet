import * as Yup from 'yup';

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
}

export default new RecipientController();
