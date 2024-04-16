import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FullUser, User } from '../models/user';
import { TeamService } from './team.service';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  collectionName = 'Users';

  constructor(
    private afs: AngularFirestore,
    private teamService: TeamService
  ) {}

  async createUser(user: User) {
    const teamId = this.afs.createId();
    await this.teamService.createTeam({
      id: teamId,
      name: 'Személyes',
      members: [user.id],
      boards: [],
    });
    user.teams.push(teamId);
    return this.afs
      .collection<User>(this.collectionName)
      .doc(user.id)
      .set(user);
  }

  updateUser(user: FullUser) {
    return this.afs
      .collection<FullUser>(this.collectionName)
      .doc(user.id)
      .update(user);
  }

  deleteUser(userId: string) {
    return this.afs
      .collection<FullUser>(this.collectionName)
      .doc(userId)
      .delete();
  }

  getUsers() {
    return this.afs.collection<FullUser>(this.collectionName).valueChanges();
  }

  getUserById(userId: string) {
    return this.afs
      .collection<User>(this.collectionName)
      .doc(userId)
      .valueChanges();
  }

  getUserByIdPromise(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<User>(this.collectionName)
        .doc(userId)
        .get()
        .subscribe({
          next: (user) => {
            if (user.exists) resolve(user.data() as User);
            else reject(`User ${userId} not found`);
          },
          error: (err) => reject(err),
        });
    });
  }


}
