import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsComponent } from './teams.component';
import { BoardComponent } from './board/board.component';


@NgModule({
  declarations: [
    TeamsComponent,
    BoardComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TeamsRoutingModule
  ]
})
export class TeamsModule { }
