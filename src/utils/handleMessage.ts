import { WebSocket } from 'ws';
import handlePlayer from './handlePlayer';
import handleRoom from './handleRoom';

const handleMessage = async (ws: WebSocket, message: any) => {
  switch (message.type) {
    case 'reg':
      return handlePlayer(ws, message);
    case 'create_room':
      return handleRoom(ws, message);
    default:
      console.warn('Unknown message type:', message.type);
      return null;
  }
};
export default handleMessage;
