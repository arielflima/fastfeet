import Delivery from '../models/Delivery';

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;

    const deliveriesToDeliveryman = await Delivery.findAll({
      where: { deliveryman_id: id },
    });

    return res.json(deliveriesToDeliveryman);
  }
}

export default new DeliveryStatusController();
