import { Component, OnInit, Optional } from '@angular/core';
import { TeamService } from '../../shared/services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../shared/models/team';
import { LoggerService } from '../../shared/services/logger.service';
import { Board, FullBoard } from '../../shared/models/board';
import { BoardService } from '../../shared/services/board.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  team?: Team;
  boards?: Board[];

  constructor(
    private teamService: TeamService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    @Optional() private logger: LoggerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.team = await this.teamService.getTeamById(params["id"]);
      this.boards = await this.getBoards(this.team.boards);
    });
  }

  async getBoards(boardIds: string[]): Promise<Board[]> {
    const boards: Board[] = [];
    boardIds.forEach(async boardId => {
      let board = await this.boardService.getBoardById(boardId);
      boards.push(board);
    });
    return boards;
  }
}
