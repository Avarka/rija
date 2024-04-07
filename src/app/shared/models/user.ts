import { Team } from "./team";

export interface User {
    id: string;
    username: string; //displayName
    email: string;
    teams: Array<Team | string>;
}
