import { FullUser } from './user';

export interface Comment {
  id: string;
  author: FullUser;
  created: Date;
  updated: Date;
  content: string;
}
