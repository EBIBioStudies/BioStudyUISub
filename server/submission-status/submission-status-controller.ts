import { EventEmitter } from 'events';
import { Request, Response, Router } from 'express';

export const stream = new EventEmitter();

export const submStatusController = (path: string, router: Router) => {
  router.use(path, (req: Request, res: Response) => {
    res.set({
      'Content-Type': 'text/event-stream;charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'none',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // This is a hack to bypass antivirus blocking for server sent events.
    // If the connection is not secure (https), it writes a ~2mb stream
    // to let the antivirus validate the stream. See https://stackoverflow.com/q/62129788/13934612
    if (!req.secure) {
      res.write(new Array(1024 * 1024).fill(0).toString());
    }

    const sendEvent = (event: string, data: string) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${data}`);
      res.write('\n\n');
      res.flushHeaders();
    };

    stream.on('push', sendEvent);

    const intervalId = setInterval(() => {
      sendEvent('ping', JSON.stringify({ time: new Date().toLocaleTimeString() }));
    }, 60 * 1000);

    req.on('close', () => {
      stream.removeListener('push', sendEvent);
      clearInterval(intervalId);
    });
  });
};
