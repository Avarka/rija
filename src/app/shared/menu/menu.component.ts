import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { Team } from '../models/team';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamComponent } from '../../dialogs/create-team/create-team.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() teamCount: number = 1;
  @Input() loadingTeams: boolean = true;
  @Input() teams = new Array<Team>();
  @Output() teamCreated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    @Optional() private logger: LoggerService,
  ) {}

  openCreateTeamDialog() {
    let dialogRef = this.dialog.open(CreateTeamComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.teamCreated.emit(true);
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
