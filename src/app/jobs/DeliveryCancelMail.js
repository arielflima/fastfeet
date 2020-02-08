import Mail from '../../lib/Mail';

class DeliveryCancelMail {
  get key() {
    return 'DeliveryCancelMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, problem } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Entrega de id ${delivery.id} foi cancelada`,
      template: 'deliveryCancelled',
      context: {
        deliveryman: deliveryman.name,
        deliveryId: delivery.id,
        problemId: problem.id,
      },
    });
  }
}

export default new DeliveryCancelMail();
