import { DEFAULT_PORT } from './common/constants';
import httpServer from './server/http_server';
import './server/ws_server';

console.log(`Start static http server on the ${DEFAULT_PORT} port!`);
httpServer.listen(DEFAULT_PORT);
