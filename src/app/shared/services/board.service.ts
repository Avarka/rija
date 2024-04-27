import { Injectable, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoggerService } from './logger.service';
import { Board, FullBoard } from '../models/board';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  collectionName = 'Boards';

  constructor(
    private afs: AngularFirestore,
    private ticketService: TicketService,
    @Optional() private logger: LoggerService,
  ) {}

  createBoard(board: Board) {
    return this.afs
      .collection<Board>(this.collectionName)
      .doc(board.id)
      .set(board);
  }

  updateBoard(board: Board) {
    return this.afs
      .collection<Board>(this.collectionName)
      .doc(board.id)
      .update(board);
  }

  async getBoardById(boardId: string): Promise<Board> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection<Board>(this.collectionName)
        .doc(boardId)
        .get()
        .subscribe({
          next: (team) => {
            if (team.exists) resolve(team.data() as Board);
            else reject(`Board ${boardId} not found`);
          },
          error: (err) => reject(err),
          complete: () => {
            if (this.logger) {
              this.logger.log(
                `BoardService.getBoardById(${boardId}) completed.`,
              );
            }
          },
        });
    });
  }

  getFullBoardById(boardId: string): Promise<FullBoard> {
    return new Promise(async (resolve, reject) => {
      const board: Board = await this.getBoardById(boardId);
      if (!board) {
        reject(`Board ${boardId} not found`);
      }
      const tickets = await Promise.all(
        board.tickets.map((ticketId) =>
          this.ticketService.getTicketById(ticketId),
        ),
      );
      resolve({ ...board, tickets });
    });
  }

  deleteBoard(board: Board) {
    return this.deleteBoardById(board.id);
  }

  deleteBoardById(boardId: string) {
    return this.afs
      .collection<Board>(this.collectionName)
      .doc(boardId)
      .delete();
  }

  async addTicketToBoard(boardId: string, ticketId: string) {
    return this.getBoardById(boardId).then((board) => {
      board.tickets.push(ticketId);
      return this.updateBoard(board);
    });
  }
}
