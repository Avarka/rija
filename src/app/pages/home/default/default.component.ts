import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { TicketService } from '../../../shared/services/ticket.service';
import { Ticket } from '../../../shared/models/ticket';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  ticketsAssignedToMe?: Ticket[];
  ticketsCreatedByMe?: Ticket[];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ticketService: TicketService,
  ) {}

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    const user = await this.userService.getUserByIdPromise(userId ?? '');
    this.ticketsAssignedToMe =
      await this.ticketService.getAssignedTicketForUser(user.id);
    this.ticketsCreatedByMe = await this.ticketService.getReportedTicketForUser(
      user.id,
    );
  }
}
