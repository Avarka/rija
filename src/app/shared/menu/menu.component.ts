import { Component, OnInit, Optional } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private teamService: TeamService,
    @Optional() private logger: LoggerService
  ) {
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.authService.getUserId().then((userId) => {
      if (!userId) return;
      this.userService.getUserById(userId).subscribe((user) => {
        if (!user) return;
        this.user = user;
        this.getTeams();
      });
    });
  }

  getTeams() {
    for (let team of this.user.teams) {
      this.teamService.getTeamById(team as string).subscribe((team) => {
        if (!team) return;
        this.user.teams.push(team);
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
