import { WebSocket, WebSocketServer } from 'ws';
import handleMessage from '../utils/handleMessage';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', async (message: any) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Message received:', data);

      const result = await handleMessage(ws, data);

      if (result) {
        console.log('Response sent:', result);
        ws.send(JSON.stringify(result));
      }
    } catch (error) {
      console.error('Invalid message', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
