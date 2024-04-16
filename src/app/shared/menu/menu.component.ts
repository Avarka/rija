import { Component, OnInit, Optional } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';
import { TeamService } from '../services/team.service';
import { FullTeam, Team } from '../models/team';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  user?: User;
  teams?: Array<Team>;
  laodingTeams: boolean = true;
  teamCount: number = 1;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private teamService: TeamService,
    private router: Router,
    @Optional() private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().then(async (userId) => {
      if (!userId) return;
      this.laodingTeams = true;
      this.user = await this.getUser(userId);
      this.teams = this.getTeams(this.user.teams);
      this.laodingTeams = false;
    });
  }

  getUser(userId: string) {
    return this.userService.getUserByIdPromise(userId);
  }

  getTeams(teamIds: Array<string>): Array<Team> {
    const teams: Array<Team> = [];
    teamIds.forEach(async (teamId) => {
      let team = await this.teamService.getTeamById(teamId);

      teams.push(team);
    });
    return teams;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
