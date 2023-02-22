import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import config from 'config';
import { logger } from '../logger';

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };

const assertAndConsumeQueue = async (
  channel: Channel,
  queueName: string,
  onMessage: (message: ConsumeMessage | null) => any
) => {
  const ackMsg = (message: ConsumeMessage | null) => {
    if (message) {
      onMessage(message);
      channel.ack(message);
    }
  };

  await channel.assertQueue(queueName, assertQueueOptions);

  return channel.consume(queueName, ackMsg, consumeQueueOptions);
};

export const listenToQueue = async (queueName: string, onMessage: (message: ConsumeMessage | null) => any) => {
  const uri: string = config.get('rabbitmq.uri');

  try {
    const connection: Connection = await amqp.connect(uri);
    connection.on('error', _ => logger.error('Rabbit connection error'));
    connection.on('close', _ => listenToQueue(queueName, onMessage));
    const channel: Channel = await connection.createChannel();

    logger.info(`Consuming queue ${queueName} from RabbitMQ`);

    return assertAndConsumeQueue(channel, queueName, onMessage);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.warn(`Couldn't connect to RabbitMQ on ${uri}`);
    } else {
      logger.error('rabbitmq-consumer', error);
    }

    setTimeout(_ => listenToQueue(queueName, onMessage), 5*1000);
  }
};
