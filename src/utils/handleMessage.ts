import { WebSocket } from 'ws';
import handlePlayer from './handlePlayer';

const handleMessage = async (ws: WebSocket, message: any) => {
  switch (message.type) {
    case 'reg':
      return handlePlayer(ws, message);
    default:
      console.warn('Unknown message type:', message.type);
      return null;
  }
};
export default handleMessage;
