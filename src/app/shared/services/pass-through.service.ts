import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root',
})
export class PassThroughService {
  private toolbarTitle: Subject<string> = new Subject<string>();
  private currentlySelectedTeam: Subject<Team | undefined> = new Subject<Team | undefined>();

  constructor() {}

  get getTitle(): Observable<string> {
    return this.toolbarTitle.asObservable();
  }

  get getCurrentlySelectedTeam(): Observable<Team | undefined> {
    return this.currentlySelectedTeam.asObservable();
  }

  changeTitle = (title: string) => this.toolbarTitle.next(title);
  clearTitle = () => this.changeTitle('');

  changeCurrentlySelectedTeam = (team: Team | undefined) => this.currentlySelectedTeam.next(team);
  clearCurrentlySelectedTeam = () => this.changeCurrentlySelectedTeam(undefined);
}
