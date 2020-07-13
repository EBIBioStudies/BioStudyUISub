import config from 'config';
import { ConsumeMessage } from 'amqplib';
import { stream } from './submission-status-controller';
import { listenToQueue } from '../rabbitmq/rabbitmq-consumer';
import { logger } from '../logger';

export interface SubmStatus {
  accNo: string,
  status: string
}

const queueName: string = config.get('rabbitmq.submStatusQueueName');

const processMessage = (msg: ConsumeMessage) => {
  try {
    const submStatus: SubmStatus = JSON.parse(msg.content.toString());
    const { accNo, status } = submStatus;

    // Only sends accNo and status to client.
    stream.emit('push', 'subm-status', JSON.stringify({ accNo, status }));
  } catch (error) {
    logger.error('submission-status-processor', error);
  }
};

export const processSubmStatus = () => {
  return listenToQueue(queueName, processMessage);
};
