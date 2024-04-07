import { Status } from "./status";
import { Team } from "./team";
import { Ticket } from "./ticket";

export interface Board {
    id: string;
    team: Team;
    name: string;
    statuses: Array<Status>;
    tickets: Array<Ticket>;
}
