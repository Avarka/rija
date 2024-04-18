import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../shared/services/team.service';
import { Team } from '../../shared/models/team';
import { MatDialogRef } from '@angular/material/dialog';
import { Board, newInProgressDoneBoard } from '../../shared/models/board';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardService } from '../../shared/services/board.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss',
})
export class CreateTeamComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    template: new FormControl(''),
  });

  constructor(
    private teamsService: TeamService,
    private dialogRef: MatDialogRef<CreateTeamComponent>,
    private afs: AngularFirestore,
    private boardService: BoardService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async onSubmit() {
    if (!this.form.valid) return;
    const newTeamId = this.afs.createId();
    const boards: Array<Board> = [];

    switch (this.form.value.template) {
      case 'default':
        const stateIds = {
          new: this.afs.createId(),
          inProgress: this.afs.createId(),
          done: this.afs.createId(),
        };
        boards.push(newInProgressDoneBoard(stateIds, newTeamId, this.afs.createId()));
        break;
      default:
        break;
    }
    const team: Team = {
      name: this.form.value.name,
      boards: boards.map((board) => board.id),
      id: newTeamId,
      members: [await this.authService.getUserId() ?? ""],
    };
    await Promise.all(boards.map((board) => this.boardService.createBoard(board)));
    this.userService.addTeamToCurrentUser(team.id);
    this.teamsService.createTeam(team, false).then(() => {
      this.form.reset();
      this.dialogRef.close(true);
    });
  }
}
