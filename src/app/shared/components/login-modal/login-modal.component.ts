import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  username: string;
  password: string;

  loggingIn = false;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private loginService: LoginService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login() {
    this.loggingIn = true;
    this.loginService.login(this.username, this.password).subscribe(result => {
      this.dialogRef.close();
    }, error => {
      console.log(error);
      this.modalService.errorDialog(
        'Login failed', 
        error
      );
      this.loggingIn = false;
    });
  }

}
