import config from 'config';
import { Router } from 'express';
import { IncomingWebhook } from '@slack/webhook';
import { ExpressUri } from '../app';

export const loggerProxy = (path: string, router: Router) => {
  const { hostname }: ExpressUri = config.get('express');
  const logsWebhookUrl: string = config.get('logs.slack_webhook_url');
  const logsEnvironment: string = config.get('logs.environment');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const webhook = new IncomingWebhook(logsWebhookUrl);

  router.use(path, async (req, res) => {
    const { origin = '' } = req.headers;
    const { hostname: originHostname } = new URL(origin);

    if (originHostname === hostname && logsWebhookUrl.length > 0 && !isDevelopment) {
      const { message, userEmail, params = [] } = req.body;

      await webhook.send({
        attachments: params.map((param: string) => ({ text: param })),
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `:warning: Error in ${logsEnvironment}`,
              emoji: true
            }
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: message
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'plain_text', text: userEmail },
              {
                type: 'plain_text',
                text: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`
              }
            ]
          }
        ]
      });
    }

    res.send();
  });
};
