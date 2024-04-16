import { Injectable, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FullTeam, Team } from '../models/team';
import { LoggerService } from './logger.service';
import { BoardService } from './board.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  collectionName = 'Teams';

  constructor(
    private afs: AngularFirestore,
    private boardService: BoardService,
    @Optional() private logger: LoggerService
  ) {}

  async createTeam(team: Team) {
    const boardId = this.afs.createId();
    const stateIds = {
      new: this.afs.createId(),
      inProgress: this.afs.createId(),
      done: this.afs.createId(),
    };
    await this.boardService.createBoard({
      id: boardId,
      team: team.id,
      name: 'Alapértelmezett tábla',
      statuses: [
        {
          id: stateIds.new,
          name: 'Új',
          color: '#FF0000',
          previousStatuses: [],
          nextStatuses: [stateIds.inProgress],
        },
        {
          id: stateIds.inProgress,
          name: 'Folyamatban',
          color: '#00FF00',
          previousStatuses: [stateIds.new],
          nextStatuses: [stateIds.done],
        },
        {
          id: stateIds.done,
          name: 'Kész',
          color: '#0000FF',
          previousStatuses: [stateIds.inProgress],
          nextStatuses: [],
        },
      ],
      tickets: [],
    });
    team.boards.push(boardId);
    return this.afs
      .collection<Team>(this.collectionName)
      .doc(team.id)
      .set(team);
  }

  updateTeam(team: FullTeam) {
    return this.afs
      .collection<FullTeam>(this.collectionName)
      .doc(team.id)
      .update(team);
  }

  deleteTeam(teamId: string) {
    return this.afs
      .collection<FullTeam>(this.collectionName)
      .doc(teamId)
      .delete();
  }

  getTeams() {
    return this.afs.collection<Team>(this.collectionName).valueChanges();
  }

  getTeamById(teamId: string): Promise<Team> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<Team>(this.collectionName)
        .doc(teamId)
        .get()
        .subscribe({
          next: (team) => {
            if (team.exists) resolve(team.data() as Team);
            else reject(`Team ${teamId} not found`);
          },
          error: (err) => reject(err),
          complete: () => {
            if (this.logger) {
              this.logger.log(`TeamService.getTeamById(${teamId}) completed.`);
            }
          },
        });
    });
  }
}
