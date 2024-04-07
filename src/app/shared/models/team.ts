import { Board } from "./board";
import { User } from "./user";

export interface Team {
    id: string;
    name: string;
    members: Array<User | string>;
    boards: Array<Board>;
}
