import { Comment } from './comment';
import { Status } from './status';
import { User } from './user';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignee: string;
  reporter: string;
  created: Date;
  updated: Date;
  comments: Array<Comment>;
}

export interface FullTicket {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignee: User;
  reporter: User;
  created: Date;
  updated: Date;
  comments: Array<Comment>;
}
