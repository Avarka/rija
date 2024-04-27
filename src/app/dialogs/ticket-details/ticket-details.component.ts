import {
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from '@angular/core';
import { LoggerService } from '../../shared/services/logger.service';
import { TicketService } from '../../shared/services/ticket.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FullTicket } from '../../shared/models/ticket';
import { Status } from '../../shared/models/status';
import { User } from '../../shared/models/user';
import { FullTicketConverterPipe } from '../../shared/pipes/full-ticket-converter.pipe';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss',
})
export class TicketDetailsComponent {
  @Output() onUpdateTicket: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteTicket: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;
  ticket: FullTicket;
  statuses: Status[];
  usersInTeam: User[];

  constructor(
    private ticketService: TicketService,
    private fullTicketConverter: FullTicketConverterPipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TicketDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ticket: FullTicket;
      statuses: Status[];
      usersInTeam: User[];
    },
    @Optional() private logger: LoggerService,
  ) {
    this.ticket = data.ticket;
    this.statuses = data.statuses;
    this.usersInTeam = data.usersInTeam;
  }

  editTicketToggle() {
    this.editMode = !this.editMode;
  }

  async saveTicket() {
    const ticket = await this.fullTicketConverter.transform(this.ticket, true);
    ticket.status = this.statuses.find(
      (status) => status.id === ticket.status.id,
    )!;
    await this.ticketService.updateTicket(ticket);
    this.onUpdateTicket.emit();
    this.editMode = false;
    this.dialogRef.close();
  }

  confirmDelete() {
    this.dialogRef.close(this.ticket.id);
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteCurrentlySelectedTicket();
      } else {
        dialogRef.close();
      }
    });
  }

  async deleteCurrentlySelectedTicket() {
    await this.ticketService.deleteTicket(this.ticket.id);
    this.onDeleteTicket.emit(this.ticket.id);
    this.dialogRef.close();
  }
}
