import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { CreateTicketComponent } from './ticket/create-ticket/create-ticket.component';

const routes: Routes = [
  { path: '', component: TeamsComponent },
  {
    path: 'create-ticket/:boardId',
    component: CreateTicketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
