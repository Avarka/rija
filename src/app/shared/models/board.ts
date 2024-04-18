import { Status } from './status';
import { Ticket } from './ticket';

export interface FullBoard {
  id: string;
  team: string;
  name: string;
  statuses: Array<Status>;
  tickets: Array<Ticket>;
}

export interface Board {
  id: string;
  team: string;
  name: string;
  statuses: Array<Status>;
  tickets: Array<string>;
}

export const emptyBoard: Board = {
  id: '',
  team: '',
  name: '',
  statuses: [],
  tickets: [],
};

export const newInProgressDoneBoard = (stateIds: {
  new: string;
  inProgress: string;
  done: string;
}, teamId: string, boardId: string,  boardName = "Alapértelmezett tábla"): Board => {
  return {
    id: boardId,
    team: teamId,
    name: boardName,
    statuses: [
      {
        id: stateIds.new,
        name: 'Új',
        color: '#FF0000',
        previousStatuses: [],
        nextStatuses: [stateIds.inProgress],
      },
      {
        id: stateIds.inProgress,
        name: 'Folyamatban',
        color: '#00FF00',
        previousStatuses: [stateIds.new],
        nextStatuses: [stateIds.done],
      },
      {
        id: stateIds.done,
        name: 'Kész',
        color: '#0000FF',
        previousStatuses: [stateIds.inProgress],
        nextStatuses: [],
      },
    ],
    tickets: [],
  };
};
