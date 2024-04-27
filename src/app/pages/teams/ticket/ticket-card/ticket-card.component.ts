import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../../shared/models/ticket';
import { MatDialog } from '@angular/material/dialog';
import { TicketDetailsComponent } from '../../../../dialogs/ticket-details/ticket-details.component';
import { FullTicketConverterPipe } from '../../../../shared/pipes/full-ticket-converter.pipe';
import { Status } from '../../../../shared/models/status';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
})
export class TicketCardComponent {
  @Input() displayOnly!: boolean;
  @Input() ticket!: Ticket;
  @Input() statuses!: Status[];
  @Input() usersInTeam!: User[] | null;
  @Output() onUpdateTicket: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteTicket: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private fullTicketConverter: FullTicketConverterPipe,
  ) {}

  async onTicketClick() {
    if (this.displayOnly) return;
    let dialogRef = this.dialog.open(TicketDetailsComponent, {
      width: '700px',
      data: {
        ticket: await this.fullTicketConverter.transform(this.ticket),
        statuses: this.statuses,
        usersInTeam: this.usersInTeam,
      },
    });

    const subUpdate = dialogRef.componentInstance.onUpdateTicket.subscribe(
      () => {
        this.onUpdateTicket.emit();
      },
    );

    const subDelete = dialogRef.componentInstance.onDeleteTicket.subscribe(
      (ticketId: string) => {
        this.onDeleteTicket.emit(ticketId);
        subDelete.unsubscribe();
      },
    );

    dialogRef.afterClosed().subscribe(() => {
      subUpdate.unsubscribe();
    });
  }
}
