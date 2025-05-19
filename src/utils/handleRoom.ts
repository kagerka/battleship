import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import { IAddPlayerToRoomIn, INewRoomIn } from '../common/interfaces';
import { games, players, rooms } from './database';

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
  const roomId = uuidv4();
  rooms.set(roomId, { id: roomId, players: [sender] });
  updateRoom();
}

function addPlayerToRoom(sender: any, roomId: string) {
  const room = rooms.get(roomId);
  if (!room || room.players.length >= 2) return;

  room.players.push(sender);

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

  updateRoom();
}

const handleRoom = async (ws: WebSocket, message: INewRoomIn | IAddPlayerToRoomIn) => {
  const sender = [...players.values()].find((player) => player.socket === ws);
  if (!sender) return;

  switch (message.type) {
    case 'create_room':
      createRoom(sender);
      break;

    case 'add_user_to_room':
      addPlayerToRoom(sender, message.data.indexRoom as string);
      break;

    default:
      break;
  }
};

export default handleRoom;
