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
    console.log('logging in...');
    this.loginService.login(this.username, this.password).subscribe(result => {
      this.dialogRef.close();
    }, error => {
      this.modalService.errorDialog(
        'Login faled', 
        error
      );
    });
  }

}
