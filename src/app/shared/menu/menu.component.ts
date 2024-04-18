import { Component, OnInit, Optional } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';
import { TeamService } from '../services/team.service';
import { FullTeam, Team } from '../models/team';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamComponent } from '../../dialogs/create-team/create-team.component';

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
    private dialog: MatDialog,
    @Optional() private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().then(async (userId) => {
      if (!userId) return;
      this.laodingTeams = true;
      this.user = await this.getUser(userId);
      this.teams = this.getTeams();
      this.laodingTeams = false;
    });
  }

  getUser(userId: string) {
    return this.userService.getUserByIdPromise(userId);
  }

  getTeams(): Array<Team> {
    const teamIds = this.user!.teams;
    const teams: Array<Team> = [];
    teamIds.forEach(async (teamId) => {
      let team = await this.teamService.getTeamById(teamId);

      teams.push(team);
    });
    return teams;
  }

  openCreateTeamDialog() {
    let dialogRef = this.dialog.open(CreateTeamComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.laodingTeams = true;
        this.teamCount++;
        await this.getUser(this.user!.id);
        this.teams = this.getTeams();
        this.laodingTeams = false;
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
