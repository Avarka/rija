import { Injectable, Optional } from '@angular/core';
import { LoggerService } from './logger.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  collectionName = 'Tickets';

  constructor(
    private afs: AngularFirestore,
    @Optional() private logger: LoggerService,
  ) {}

  createTicket(ticket: Ticket) {
    return this.afs
      .collection<Ticket>(this.collectionName)
      .doc(ticket.id)
      .set(ticket);
  }

  updateTicket(ticket: Ticket) {
    return this.afs
      .collection<Ticket>(this.collectionName)
      .doc(ticket.id)
      .update(ticket);
  }

  deleteTicket(ticketId: string) {
    return this.afs
      .collection<Ticket>(this.collectionName)
      .doc(ticketId)
      .delete();
  }

  getTicketById(ticketId: string): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<Ticket>(this.collectionName)
        .doc(ticketId)
        .get()
        .subscribe({
          next: (ticket) => {
            if (ticket.exists) resolve(ticket.data() as Ticket);
            else reject(`Ticket ${ticketId} not found`);
          },
          error: (err) => reject(err),
          complete: () => {
            if (this.logger) {
              this.logger.log(
                `TicketService.getTicketById(${ticketId}) completed.`,
              );
            }
          },
        });
    });
  }

  getAssignedTicketForUser(userId: string): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<Ticket>(this.collectionName, (ref) =>
          ref.where('assignee', '==', userId),
        )
        .get()
        .subscribe({
          next: (tickets) => {
            resolve(tickets.docs.map((ticket) => ticket.data()));
          },
          error: (err) => reject(err),
          complete: () => {
            if (this.logger) {
              this.logger.log(
                `TicketService.getTicketForUser(${userId}) completed.`,
              );
            }
          },
        });
    });
  }

  getReportedTicketForUser(userId: string): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<Ticket>(this.collectionName, (ref) =>
          ref.where('reporter', '==', userId),
        )
        .get()
        .subscribe({
          next: (tickets) => {
            resolve(tickets.docs.map((ticket) => ticket.data()));
          },
          error: (err) => reject(err),
          complete: () => {
            if (this.logger) {
              this.logger.log(
                `TicketService.getTicketForUser(${userId}) completed.`,
              );
            }
          },
        });
    });
  }
}
