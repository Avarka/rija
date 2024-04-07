import { Comment } from "./comment";
import { Status } from "./status";
import { User } from "./user";

export interface Ticket {
    id: string;
    displayId: string;
    title: string;
    description: string;
    status: Status;
    assignee: User | null;
    reporter: User;
    created: Date;
    updated: Date;
    comments: Array<Comment>;
}
