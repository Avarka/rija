import { Component, Input, OnInit, Optional } from '@angular/core';
import { FullBoard } from '../../../shared/models/board';
import { LoggerService } from '../../../shared/services/logger.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Ticket } from '../../../shared/models/ticket';
import { TicketService } from '../../../shared/services/ticket.service';
import { User } from '../../../shared/models/user';
import { BoardService } from '../../../shared/services/board.service';
import { FullBoardConverterPipe } from '../../../shared/pipes/full-board-converter.pipe';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  @Input({ required: true }) boardPromise!: Promise<FullBoard>;
  @Input({ required: true }) usersInTeam!: User[] | null;
  board!: FullBoard;
  ticketsInColumns: { [key: string]: Ticket[] } = {};

  constructor(
    private ticketService: TicketService,
    private boardService: BoardService,
    private fullBoardConverter: FullBoardConverterPipe,
    @Optional() private logger: LoggerService,
  ) {}

  async ngOnInit() {
    this.board = await this.boardPromise;
    this.board.statuses.forEach((status) => {
      this.ticketsInColumns[status.id] = [];
    });
    this.board.tickets.forEach((ticket) => {
      this.ticketsInColumns[ticket.status.id].push(ticket);
    });

    this.logger.log(this.ticketsInColumns);
  }

  ticketDrop(event: CdkDragDrop<Ticket[]>) {
    if (!this.board) return;
    if (event.previousContainer === event.container) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.container.data.length,
    );

    const ticket: Ticket = event.item.data;
    ticket.status = this.board.statuses.find(
      (status) => status.id === event.container.id,
    )!;
    this.ticketService.updateTicket(ticket);
  }

  async refreshTickets() {
    const board = await this.boardService.getBoardById(this.board.id);
    this.board = await this.fullBoardConverter.transform(board);

    this.board.statuses.forEach((status) => {
      this.ticketsInColumns[status.id] = [];
    });
    this.board.tickets.forEach((ticket) => {
      this.ticketsInColumns[ticket.status.id].push(ticket);
    });
  }

  async handleTicketDelete(ticketId: string) {
    const board = await this.boardService.getBoardById(this.board.id);
    board.tickets = board.tickets.filter((ticket) => ticket !== ticketId);
    await this.boardService.updateBoard(board);
    await this.refreshTickets();
  }
}
