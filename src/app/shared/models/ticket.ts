import { Comment } from "./comment";
import { Status } from "./status";
import { FullUser } from "./user";

export interface Ticket {
    id: string;
    displayId: string;
    title: string;
    description: string;
    status: Status;
    assignee: FullUser | null;
    reporter: FullUser;
    created: Date;
    updated: Date;
    comments: Array<Comment>;
}
