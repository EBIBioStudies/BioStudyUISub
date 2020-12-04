import config from 'config';
import { Router } from 'express';
import request from 'request';

export const loggerProxy = (path: string, router: Router) => {
  const logsWebhookUrl: string = config.get('logs.slack_webhook_url');
  const logsEnvironment: string = config.get('logs.environment');
  const isDevelopment = process.env.NODE_ENV === 'development';

  router.use(path, async (req, res) => {
    if (logsWebhookUrl.length > 0 && !isDevelopment) {
      const { message, userEmail, params = [] } = req.body;
      const body = {
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
      };

      try {
        request.post(logsWebhookUrl, { json: body });
      } catch (error) {
        console.error(error);
      }
    }

    res.send();
  });
};
