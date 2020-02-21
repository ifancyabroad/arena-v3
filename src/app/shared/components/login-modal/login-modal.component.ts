import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login() {
    console.log('logging in...');
    console.log(this.username);
    console.log(this.password);
  }

}
