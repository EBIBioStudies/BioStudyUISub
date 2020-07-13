import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import config from 'config';
import { logger } from '../logger';

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };

const uri: string = config.get('rabbitmq.uri');

const assertAndConsumeQueue = async (channel: Channel, queueName: string, onMessage: (message: ConsumeMessage | null) => any) => {

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
  try {
    const connection: Connection = await amqp.connect(uri);
    const channel: Channel = await connection.createChannel();

    logger.info(`Consuming queue ${queueName} from ${uri}`);

    return assertAndConsumeQueue(channel, queueName, onMessage);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.warn(`Couldn't connect to RabbitMQ on ${uri}`);
    } else {
      logger.error('rabbitmq-consumer', error);
    }
  }
};
