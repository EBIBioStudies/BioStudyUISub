import { Request, Response, Router } from 'express';
import needle from 'needle';
import { PathInfo } from '../../src/app/file/shared/file-rest.model';

export const fileListController = (path: string, router: Router) => {
  router.get(path, async (req: Request, res: Response) => {
    const folder = req.url.substr('/file-list/'.length);
    res.set({
      'Content-Disposition': `attachment; filename= ${folder.startsWith('user/') ? folder.substr(5) : folder}.tsv`,
      'Content-Type': 'text/tab-separated-values'
    });

    res.write('Files\n');
    processFolder(folder, req, res).then(() => res.send());
  });

  function processFolder(folder: string, req: Request, res: Response) {
    const url = `${req.get('host')}/api/files/user/${folder}`;
    const headers = { 'X-Session-Token': req?.cookies['BioStudiesToken'] || '' };

    return new Promise((resolve) => {
      needle('get', url, { headers: headers })
        .then((response) => {
          const folders: string[] = [];
          if (response.statusCode != 200) {
            res.sendStatus(response.status);
            resolve();
            return;
          }
          response.body.forEach((node: PathInfo) => {
            if (node.type === 'FILE') {
              res.write(`${node.path.startsWith('user/') ? node.path.substr(5) : node.path}/${node.name}\n`);
            } else {
              folders.push(`${node.path}/${node.name}`);
            }
          });
          Promise.all(folders.sort().map((folder) => processFolder(folder, req, res))).then(() => resolve());
        })
        .catch(function (err) {
          res.sendStatus(err?.status || 500);
          resolve();
          return;
        });
    });
  }
};
