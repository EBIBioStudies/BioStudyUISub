import { Request, Response, Router } from 'express';
import needle from 'needle';
import config from 'config';
import { ExpressUri } from '../app';
const expressConfig: ExpressUri = config.get('express');
const { context, port, hostname, protocol } = expressConfig;

export const fileListController = (path: string, router: Router) => {
  router.get(path, async (req: Request, res: Response) => {
    const folder = req.url.substr('/file-list/'.length);
    res.set({
      'Content-Disposition': `attachment; filename=${folder.substring(folder.lastIndexOf('/') + 1)}.tsv`,
      'Content-Type': 'text/tab-separated-values'
    });
    res.write('Files\n');
    processFolder(folder, req, res).then(() => res.send());
  });

  function processFolder(folder: string, req: Request, res: Response) {
    const url = `${protocol}://${hostname}:${port}${context}/api/files${
      folder.startsWith('user') ? '/' : '/user/'
    }${folder}`;
    const headers = { 'X-Session-Token': req?.cookies['BioStudiesToken'] || '' };

    return new Promise((resolve: any) => {
      needle('get', url, { headers: headers })
        .then((response: any) => {
          const folders: string[] = [];
          if (response.statusCode != 200) {
            res.sendStatus(response.status);
            resolve();
            return;
          }
          response.body.forEach((node: any) => {
            if (node.type === 'FILE') {
              res.write(`${node.path.startsWith('user/') ? node.path.substr(5) : node.path}/${node.name}\n`);
            } else {
              folders.push(`${node.path}/${node.name}`);
            }
          });
          Promise.all(folders.sort().map((folder) => processFolder(folder, req, res))).then(() => resolve());
        })
        .catch(function (err: any) {
          res.sendStatus(err?.status || 500);
          resolve();
          return;
        });
    });
  }
};
