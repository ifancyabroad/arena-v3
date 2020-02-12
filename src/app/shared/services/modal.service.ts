import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) { }

  errorDialog(title: string, content: string): void {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: { errorTitle: title, errorContent: content }
    });
  }

  confirmDialog(title: string, content: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: { title: title, content: content }
    });

    return dialogRef.afterClosed();
  }
}
