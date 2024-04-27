import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { PassThroughService } from '../../shared/services/pass-through.service';
import { Subscription } from 'rxjs';
import { Team } from '../../shared/models/team';
import { LoggerService } from '../../shared/services/logger.service';
import { TeamService } from '../../shared/services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user';
import { ConfirmDeleteComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  title: string = 'Rugalmas Információkövető Jelentések Alkalmazása';
  mobileQuery: MediaQueryList;
  currentlySelectedTeam?: Team;

  private titleChangeSubscription?: Subscription;
  private teamChangeSubscription?: Subscription;

  user?: User;
  teams: Array<Team> | null = null;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private passThroughService: PassThroughService,
    private teamService: TeamService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    @Optional() private loggerService: LoggerService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 750px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      this.mobileQuery.matches
        ? (this.title = 'RIJA')
        : (this.title = 'Rugalmas Információkövető Jelentések Alkalmazása');
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  private async updateTeams() {
    this.teams = null;
    this.user = await this.userService.getUserByIdPromise(this.user?.id ?? '');
    this.teams = await this.getTeams();
    this.loggerService?.log('Teams updated');
  }

  async ngOnInit() {
    this.titleChangeSubscription = this.passThroughService.getTitle.subscribe(
      (title) => {
        this.title =
          title === ''
            ? this.mobileQuery.matches
              ? 'RIJA'
              : 'Rugalmas Információkövető Jelentések Alkalmazása'
            : title;
      },
    );

    this.teamChangeSubscription =
      this.passThroughService.getCurrentlySelectedTeam.subscribe((team) => {
        this.currentlySelectedTeam = team;
        this.loggerService?.log('Selected team changed to: ' + team?.name);
      });

    const userId = await this.authService.getUserId();
    this.user = await this.userService.getUserByIdPromise(userId ?? '');
    await this.updateTeams();
  }

  async getTeams() {
    if (!this.user) return [];
    const teamIds = this.user.teams;
    const teams: Promise<Array<Team>> = Promise.all(
      teamIds.map(async (teamId) => {
        return await this.teamService.getTeamById(teamId);
      }),
    );
    return teams;
  }

  confirmDeleteTeam() {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteCurrentlySelectedTeam();
      }
    });
  }

  deleteCurrentlySelectedTeam() {
    Promise.all([
      this.teamService.deleteTeam(this.currentlySelectedTeam!),
      this.userService.removeTeamFromCurrentUser(
        this.currentlySelectedTeam!.id,
      ),
    ]).then(async () => {
      await this.updateTeams();
    });

    this.passThroughService.changeCurrentlySelectedTeam(undefined);
    this.router.navigate(['/home']);
  }

  async onTeamCreated() {
    await this.updateTeams();
  }

  createTicket() {
    this.router.navigate(['create-ticket'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.titleChangeSubscription?.unsubscribe();
    this.teamChangeSubscription?.unsubscribe();
  }
}
