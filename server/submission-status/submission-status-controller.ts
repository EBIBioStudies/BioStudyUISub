import { EventEmitter } from 'events';
import { Request, Router, Response } from 'express';

export const stream = new EventEmitter();

export const submStatusController = (path: string, router: Router) => {
  router.use(path, (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    stream.on('push', (event, data) => res.write(`event: ${String(event)} \ndata: ${JSON.stringify(data)} \n\n`));
  });
};
