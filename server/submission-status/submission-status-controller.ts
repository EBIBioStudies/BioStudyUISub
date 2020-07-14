import { EventEmitter } from 'events';
import { Request, Response, Application } from 'express';

export const stream = new EventEmitter();

export const submStatusController = (path: string, app: Application) => {
  app.use(path, (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write('\n');
    res.flush();

    stream.on('push', (event, data) => {
      res.write(`event: ${String(event)}\n`);
      res.write(`data: ${data}\n\n`);
      res.flush();
    });
  });
};
