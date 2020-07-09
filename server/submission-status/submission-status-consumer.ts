import amqp, { Channel, Connection } from 'amqplib';
import config from 'config';
import { logger } from '../logger';
import { stream } from './submission-status-controller';

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };

const queueName: string = config.get('rabbitMQ.queueName');
const uri: string = config.get('rabbitMQ.uri');

const processMessage = (msg) => {
  stream.emit('push', 'sum-status', msg.content.toString());
};

const assertAndConsumeQueue = async (channel: Channel) => {

  const ackMsg = (msg) => {
    processMessage(msg);
    channel.ack(msg);
  };

  await channel.assertQueue(queueName, assertQueueOptions);

  return channel.consume(queueName, ackMsg, consumeQueueOptions);
};

export const listenToSubmStatusQueue = async () => {
  try {
    const connection: Connection = await amqp.connect(uri);
    const channel: Channel = await connection.createChannel();

    logger.info(`Consuming queue ${queueName} from ${uri}`);

    return assertAndConsumeQueue(channel);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.warn(`Couldn't connect to RabbitMQ on ${uri}`);
    } else {
      logger.error('RabbitMQ', error);
    }
  }
};
