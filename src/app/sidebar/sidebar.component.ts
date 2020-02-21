import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { StateService, GameStatus } from '../shared/services/state.service';
import { LoginModalComponent } from '../shared/components/login-modal/login-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private stateService: StateService,
    public dialog: MatDialog,
  ) {}

  restart() {
    this.stateService.moveTo(GameStatus.Home);
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '400px'
    });
  }

}
