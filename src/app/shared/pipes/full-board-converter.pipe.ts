import { Optional, Pipe, PipeTransform } from '@angular/core';
import { Board, FullBoard } from '../models/board';
import { LoggerService } from '../services/logger.service';
import { BoardService } from '../services/board.service';
import { UserService } from '../services/user.service';
import { TicketService } from '../services/ticket.service';

@Pipe({
  name: 'fullBoardConverter',
})
export class FullBoardConverterPipe implements PipeTransform {
  constructor(
    private ticketService: TicketService,
    @Optional() private logger: LoggerService,
  ) {}

  async transform(board: Board): Promise<FullBoard> {
    const tickets = await Promise.all(
      board.tickets.map((ticketId) =>
        this.ticketService.getTicketById(ticketId),
      ),
    );
    return { ...board, tickets };
  }
}
