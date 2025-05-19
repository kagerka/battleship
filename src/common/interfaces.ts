import { WebSocket } from 'ws';

// PLAYER
export interface IPlayer {
  name: string;
  password: string;
  socket: WebSocket;
}

export interface IPlayerRegIn {
  type: 'reg';
  data: {
    name: string;
    password: string;
  };
  id: number;
}

export interface IPlayerRegOut {
  type: 'reg';
  data: {
    name: string;
    index: number | string | null;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export interface IPlayerWinnerOut {
  type: 'update_winners';
  data: {
    name: string;
    wins: number;
  }[];
  id: number;
}

// ROOM
export interface IRoom {
  id: string;
  players: IPlayer[];
}

export interface INewRoomIn {
  type: 'create_room';
  data: '';
  id: number;
}

export interface IAddPlayerToRoomIn {
  type: 'add_user_to_room';
  data: {
    indexRoom: number | string;
  };
  id: number;
}

export interface ICreateGameOut {
  type: 'create_game';
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
  id: number;
}

export interface IUpdateRoomOut {
  type: 'update_room';
  data: {
    roomId: number | string;
    roomUsers: {
      name: string;
      index: string | number;
    }[];
  }[];
  id: number;
}

// SHIPS
export interface IShip {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface IAddShipsIn {
  type: 'add_ships';
  data: {
    gameId: number | string;
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }[];
    indexPlayer: number | string;
  };
  id: number;
}

export interface IStartGameOut {
  type: 'start_game';
  data: {
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }[];
    currentPlayerIndex: number | string;
  };
  id: number;
}

// GAME
export interface IGame {
  id: string;
  players: {
    [id: string]: {
      id: string;
      name: string;
      board: IGameBoard;
      ready: boolean;
    };
  };
  turn: string;
}

export interface IGameBoard {
  ships: IShip[];
  hits: boolean[][];
}

export interface IAttackIn {
  type: 'attack';
  data: {
    gameId: number | string;
    x: number;
    y: number;
    indexPlayer: number | string;
  };
  id: number;
}

export interface IAttackFeedbackOut {
  type: 'attack';
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number | string;
    status: 'miss' | 'killed' | 'shot';
  };
  id: number;
}

export interface IRandomAttackIn {
  type: 'randomAttack';
  data: {
    gameId: number | string;
    indexPlayer: number | string;
  };
  id: number;
}

export interface ITurnOut {
  type: 'turn';
  data: {
    currentPlayer: number | string;
  };
  id: number;
}

export interface IFinishGameOut {
  type: 'finish';
  data: {
    winPlayer: number | string;
  };
  id: number;
}
