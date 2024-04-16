import { Component, Input, Optional } from '@angular/core';
import { Board, FullBoard } from '../../../shared/models/board';
import { LoggerService } from '../../../shared/services/logger.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  @Input({required: true}) board!: FullBoard | Board;

  constructor(
    @Optional() private logger: LoggerService
  ) {} 
}
