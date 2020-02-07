import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega para você',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        deliveryId: delivery.id,
      },
    });
  }
}

export default new NewDeliveryMail();
