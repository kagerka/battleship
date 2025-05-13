import { DEFAULT_PORT } from './src/common/constants';
import httpServer from './src/http_server/index';

console.log(`Start static http server on the ${DEFAULT_PORT} port!`);
httpServer.listen(DEFAULT_PORT);
