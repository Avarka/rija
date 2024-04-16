import { Status } from "./status";
import { Ticket } from "./ticket";

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