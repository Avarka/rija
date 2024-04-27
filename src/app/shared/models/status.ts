export interface Status {
  id: string;
  name: string;
  color: string;
  previousStatuses: Array<string>;
  nextStatuses: Array<string>;
}

type newInProgressDoneStatusesType = {
  new: Status;
  inProgress: Status;
  done: Status;
}[];

export const newInProgressDoneStatuses = (stateIds?: {
  new: string;
  inProgress: string;
  done: string;
}): newInProgressDoneStatusesType => [
  {
    new: {
      id: stateIds?.new ?? 'new',
      name: 'Új',
      color: '#FF0000',
      previousStatuses: [],
      nextStatuses: [stateIds?.inProgress ?? 'inProgress'],
    },
    inProgress: {
      id: stateIds?.inProgress ?? 'inProgress',
      name: 'Folyamatban',
      color: '#00FF00',
      previousStatuses: [stateIds?.new ?? 'new'],
      nextStatuses: [stateIds?.done ?? 'done'],
    },
    done: {
      id: stateIds?.done ?? 'done',
      name: 'Kész',
      color: '#0000FF',
      previousStatuses: [stateIds?.inProgress ?? 'inProgress'],
      nextStatuses: [],
    },
  },
];
