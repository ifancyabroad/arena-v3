import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameOverModalComponent } from './components/game-over-modal/game-over-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [ErrorModalComponent, GameOverModalComponent, ConfirmModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  entryComponents: [ErrorModalComponent, GameOverModalComponent, ConfirmModalComponent]
})
export class SharedModule { }
