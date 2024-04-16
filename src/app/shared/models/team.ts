import { FullBoard } from "./board";
import { User } from "./user";

export interface FullTeam {
    id: string;
    name: string;
    members: Array<User>;
    boards: Array<FullBoard>;
}

export interface Team {
    id: string;
    name: string;
    members: Array<string>;
    boards: Array<string>;
}

export const isTeam = (team: any): team is FullTeam => {
    return team.id && team.name && team.members && team.boards;
}
