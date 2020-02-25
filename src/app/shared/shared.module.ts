import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { GameOverModalComponent } from './components/game-over-modal/game-over-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { DataListModalComponent } from './components/data-list-modal/data-list-modal.component';

@NgModule({
  declarations: [
    ErrorModalComponent,
    GameOverModalComponent,
    ConfirmModalComponent,
    LoginModalComponent,
    DataListModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule
  ],
  entryComponents: [
    ErrorModalComponent,
    GameOverModalComponent,
    ConfirmModalComponent,
    LoginModalComponent,
    DataListModalComponent
  ]
})
export class SharedModule { }
