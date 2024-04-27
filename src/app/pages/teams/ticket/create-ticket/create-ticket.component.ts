import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Ticket } from '../../../../shared/models/ticket';
import {
  Status,
  newInProgressDoneStatuses,
} from '../../../../shared/models/status';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoggerService } from '../../../../shared/services/logger.service';
import { PassThroughService } from '../../../../shared/services/pass-through.service';
import { TicketService } from '../../../../shared/services/ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../../../../shared/models/team';
import { BoardService } from '../../../../shared/services/board.service';
import { Board } from '../../../../shared/models/board';
import { TeamService } from '../../../../shared/services/team.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../../../shared/models/user';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  createTicketForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignee: new FormControl(''),
    status: new FormControl(
      newInProgressDoneStatuses()[0].new,
      Validators.required,
    ),
  });

  team?: Team;
  board?: Board;
  members?: Array<User> = [];

  constructor(
    private ticketService: TicketService,
    private boardService: BoardService,
    private teamService: TeamService,
    private userService: UserService,
    private authService: AuthService,
    private passThroughService: PassThroughService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    @Optional() private logger: LoggerService,
  ) {
    passThroughService.changeTitle('Jegy létrehozása');
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.board = await this.boardService.getBoardById(params['boardId']);
      this.team = await this.teamService.getTeamById(this.board.team);
      this.members = await Promise.all(
        this.team.members.map((memberId) =>
          this.userService.getUserByIdPromise(memberId),
        ),
      );
      this.passThroughService.changeTitle(
        `Jegy létrehozása @ ${this.team?.name}`,
      );
    });
  }

  ngOnDestroy() {
    this.passThroughService.clearTitle();
  }

  async createTicket() {
    if (this.createTicketForm.invalid) return;

    const ticketId = this.afs.createId();

    const ticket: Ticket = {
      id: ticketId,
      title: this.createTicketForm.get('title')?.value,
      description: this.createTicketForm.get('description')?.value,
      assignee: this.createTicketForm.get('assignee')?.value,
      status: this.createTicketForm.get('status')?.value,
      reporter: (await this.authService.getUserId()) ?? '',
      created: new Date(),
      updated: new Date(),
      comments: [],
    };

    this.boardService.addTicketToBoard(this.board!.id, ticketId);
    this.ticketService.createTicket(ticket);
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
