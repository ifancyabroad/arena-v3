import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) { }

  openDialog(title: string, content: string): void {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: { errorTitle: title, errorContent: content }
    });
  }
}
