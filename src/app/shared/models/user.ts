import { FullTeam } from './team';

export interface FullUser {
  id: string;
  username: string; //displayName
  email: string;
  teams: Array<FullTeam>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  teams: Array<string>;
}
