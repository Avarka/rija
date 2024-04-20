import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PassThroughService } from '../../shared/services/pass-through.service';
import { Subscription } from 'rxjs';
import { Team } from '../../shared/models/team';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  title: string = 'Rugalmas Információkövető Jelentések Alkalmazása';
  currentlySelectedTeam?: Team;

  private titleChangeSubscription?: Subscription;
  private teamChangeSubscription?: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private passThroughService: PassThroughService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 750px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      if (this.mobileQuery.matches) {
        this.title = 'RIJA';
      } else {
        this.title = 'Rugalmas Információkövető Jelentések Alkalmazása';
      }
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit(): void {
    this.titleChangeSubscription = this.passThroughService.getTitle.subscribe(
      (title) => {
        if (title === '') {
          if (this.mobileQuery.matches) {
            this.title = 'RIJA';
          } else {
            this.title = 'Rugalmas Információkövető Jelentések Alkalmazása';
          }
          return;
        }
        this.title = title;
      }
    );

    this.teamChangeSubscription =
      this.passThroughService.getCurrentlySelectedTeam.subscribe((team) => {
        this.currentlySelectedTeam = team;
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.titleChangeSubscription?.unsubscribe();
    this.teamChangeSubscription?.unsubscribe();
  }
}
