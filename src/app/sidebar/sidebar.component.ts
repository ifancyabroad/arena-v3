import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { StateService, GameStatus } from '../shared/services/state.service';
import { LoginModalComponent } from '../shared/components/login-modal/login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService, User } from '../shared/services/login.service';
import { DataListModalComponent } from '../shared/components/data-list-modal/data-list-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private stateService: StateService,
    private loginService: LoginService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.userSubscription = this.loginService.user.subscribe(currentUser => this.user = currentUser);
  }

  restart() {
    this.stateService.moveTo(GameStatus.Home);
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginModalComponent);
  }

  logout() {
    this.loginService.logout();
  }

  openEdit(type: string) {
    const dialogRef = this.dialog.open(DataListModalComponent, {
      width: '500px',
      data: {
        type: type
      }
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
