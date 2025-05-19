import fs from 'fs';
import http from 'http';
import path from 'path';
import { STATUS_CODES } from '../common/constants';

export default http.createServer((req, res) => {
  const dirname = path.resolve(path.dirname(''));
  const filePath = dirname + (req.url === '/' ? '/front/index.html' : `/front${req.url}`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR.code, { 'Content-Type': 'text/html' });
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(STATUS_CODES.OK.code, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});
