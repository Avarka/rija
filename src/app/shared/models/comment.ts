import { User } from "./user";

export interface Comment {
    id: string;
    author: User;
    created: Date;
    updated: Date;
    content: string;
}
