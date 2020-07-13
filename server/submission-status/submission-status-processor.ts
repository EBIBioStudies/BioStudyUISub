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

const processMessage = (message: ConsumeMessage | null) => {
  try {
    const submStatus: SubmStatus = JSON.parse(message.content.toString());
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
