import Delivery from '../models/Delivery';

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
}

export default new DeliveryStatusController();
