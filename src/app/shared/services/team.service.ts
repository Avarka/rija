import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  collectionName = 'Teams';

  constructor(private afs: AngularFirestore) { }

  createTeam(team: Team) {
    team.id = this.afs.createId();
    return this.afs.collection<Team>(this.collectionName).doc(team.id).set(team);
  }

  updateTeam(team: Team) {
    return this.afs.collection<Team>(this.collectionName).doc(team.id).update(team);
  }

  deleteTeam(teamId: string) {
    return this.afs.collection<Team>(this.collectionName).doc(teamId).delete();
  }

  getTeams() {
    return this.afs.collection<Team>(this.collectionName).valueChanges();
  }

  getTeamById(teamId: string) {
    return this.afs.collection<Team>(this.collectionName).doc(teamId).valueChanges();
  }
}
