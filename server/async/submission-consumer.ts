import amqp, { Channel, Connection } from 'amqplib';
import config from 'config';
import { logger } from '../logger';

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };

const queueName: string = config.get('rabbitMQ.queueName');
const uri: string = config.get('rabbitMQ.uri');

const processMessage = (msg) => {
  console.log(msg.content.toString());

  return Promise.resolve();
};

const assertAndConsumeQueue = async (channel: Channel) => {

  const ackMsg = async (msg) => {
    await processMessage(msg);

    return channel.ack(msg);
  };

  await channel.assertQueue(queueName, assertQueueOptions);

  return channel.consume(queueName, ackMsg, consumeQueueOptions);
};

export const listenToQueue = async () => {
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
