import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy { 
  mobileQuery: MediaQueryList;
  @Input({required: true}) title: string = "Rugalmas Információkövető Jelentések Alkalmazása";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 750px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      if (this.mobileQuery.matches) {
        this.title = "RIJA";
      } else {
        this.title = "Rugalmas Információkövető Jelentések Alkalmazása";
      }
    };
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }
  
  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }
}
