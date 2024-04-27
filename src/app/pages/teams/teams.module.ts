import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsComponent } from './teams.component';
import { BoardComponent } from './board/board.component';
import { CreateTicketComponent } from './ticket/create-ticket/create-ticket.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { FullBoardConverterPipe } from '../../shared/pipes/full-board-converter.pipe';
import { ColorConverterPipe } from '../../shared/pipes/color-converter.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { SliceWordsPipe } from '../../shared/pipes/slice-words.pipe';
import { TicketDetailsComponent } from '../../dialogs/ticket-details/ticket-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FullTicketConverterPipe } from '../../shared/pipes/full-ticket-converter.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { UserConverterPipe } from '../../shared/pipes/user-converter.pipe';
import { TicketCardComponent } from './ticket/ticket-card/ticket-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TeamsComponent,
    BoardComponent,
    CreateTicketComponent,
    FullBoardConverterPipe,
    ColorConverterPipe,
    SliceWordsPipe,
    TicketDetailsComponent,
    FullTicketConverterPipe,
    UserConverterPipe,
    TicketCardComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TeamsRoutingModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    FormsModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  providers: [
    FullBoardConverterPipe,
    ColorConverterPipe,
    SliceWordsPipe,
    FullTicketConverterPipe,
  ],
})
export class TeamsModule {}
