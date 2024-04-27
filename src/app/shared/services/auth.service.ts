import { Injectable, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    @Optional() private logger: LoggerService,
  ) {}

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  isUserLoggedIn() {
    return this.auth.user;
  }

  async getUserId() {
    return await this.auth.currentUser.then((user) => {
      return user?.uid;
    });
  }

  logout() {
    return this.auth.signOut();
  }
}
