import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import { IAddPlayerToRoomIn, INewRoomIn } from '../common/interfaces';
import { games, players, rooms } from './database';

function leaveRoom(sender: any) {
  Array.from(rooms.values()).forEach((room) => {
    const index = room.players.findIndex((p) => p.name === sender.name);
    if (index !== -1) {
      room.players.splice(index, 1);
      if (room.players.length === 0) {
        rooms.delete(room.id);
      }
    }
  });
}

function updateRoom() {
  const roomList = Array.from(rooms.values()).map((room) => ({
    roomId: room.id,
    roomUsers: room.players.map((player) => ({
      name: player.name,
      index: player.name,
    })),
  }));

  const message = {
    type: 'update_room',
    data: JSON.stringify(roomList),
    id: 0,
  };

  const payload = JSON.stringify(message);
  players.forEach((player) => player.socket.send(payload));
}

function createRoom(sender: any) {
  leaveRoom(sender);

  const roomId = uuidv4();
  rooms.set(roomId, { id: roomId, players: [sender] });
  updateRoom();
}

function addPlayerToRoom(sender: any, roomId: string) {
  leaveRoom(sender);

  const room = rooms.get(roomId);
  if (!room || room.players.length >= 2) return;

  room.players.push(sender);
  updateRoom();
  if (room.players.length === 2) {
    const gameId = uuidv4();
    const gamePlayers = room.players;

    const game = {
      id: gameId,
      players: {
        [gamePlayers[0].name]: {
          id: '1',
          name: gamePlayers[0].name,
          board: { ships: [], hits: [] },
          ready: false,
        },
        [gamePlayers[1].name]: {
          id: '2',
          name: gamePlayers[1].name,
          board: { ships: [], hits: [] },
          ready: false,
        },
      },
      turn: '1',
    };

    games.set(gameId, game);
    rooms.delete(room.id);
    gamePlayers.forEach((player) => {
      const playerId = game.players[player.name].id;
      player.socket.send(
        JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({ idGame: gameId, idPlayer: playerId }),
          id: 0,
        }),
      );
    });
  }
}

const handleRoom = async (ws: WebSocket, message: INewRoomIn | IAddPlayerToRoomIn) => {
  const sender = [...players.values()].find((player) => player.socket === ws);
  if (!sender) {
    console.warn('Sender not found for ws');
    return;
  }

  const { indexRoom } = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;

  switch (message.type) {
    case 'create_room':
      createRoom(sender);
      break;

    case 'add_user_to_room':
      console.log(`Adding ${sender.name} to room ${indexRoom}`);
      addPlayerToRoom(sender, indexRoom as string);
      break;

    default:
      break;
  }
};

export default handleRoom;
