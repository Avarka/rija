import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from '../../shared/services/logger.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
})
export class ConfirmDeleteComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Optional() private loggerService: LoggerService,
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }
}
