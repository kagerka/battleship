import { WebSocket } from 'ws';
import { IPlayerRegIn } from '../common/interfaces';
import { players } from './database';

const handlePlayer = async (ws: WebSocket, message: IPlayerRegIn): Promise<any> => {
  let { data } = message;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      return {
        type: 'reg',
        data: JSON.stringify({
          name: '',
          index: null,
          error: true,
          errorText: 'Invalid JSON format',
        }),
        id: 0,
      };
    }
  }

  const { name, password } = data;

  if (!name || !password) {
    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: null,
        error: true,
        errorText: 'Name and password are required',
      }),
      id: 0,
    };
  }

  const playerExists = players.get(name);

  if (playerExists) {
    if (playerExists.password !== password) {
      return {
        type: 'reg',
        data: JSON.stringify({
          name,
          index: null,
          error: true,
          errorText: 'Incorrect password',
        }),
        id: 0,
      };
    }

    playerExists.socket = ws;

    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: name,
        error: false,
        errorText: '',
      }),
      id: 0,
    };
  }

  const newPlayer = {
    name,
    password,
    socket: ws,
  };

  players.set(name, newPlayer);

  return {
    type: 'reg',
    data: JSON.stringify({
      name,
      index: name,
      error: false,
      errorText: '',
    }),
    id: 0,
  };
};

export default handlePlayer;
