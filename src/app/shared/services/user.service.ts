import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'Users';

  constructor(private afs: AngularFirestore, private teamService: TeamService) { }

  async createUser(user: User) {
    const teamId = this.afs.createId();
    await this.teamService.createTeam({
      id: teamId,
      name: 'Személyes',
      members: [user.id],
      boards: []
    });
    user.teams.push(teamId);
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  updateUser(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).update(user);
  }

  deleteUser(userId: string) {
    return this.afs.collection<User>(this.collectionName).doc(userId).delete();
  }

  getUsers() {
    return this.afs.collection<User>(this.collectionName).valueChanges();
  }

  getUserById(userId: string) {
    return this.afs.collection<User>(this.collectionName).doc(userId).valueChanges();
  }
}
