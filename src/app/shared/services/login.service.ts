import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  username: string;
  userId: string;
  token: string;
}

export interface User {
  username: string;
  userId: string;
  token: string;
  expiryDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _user = new BehaviorSubject<User>(null);;

  constructor(private http: HttpClient, private config: Config) {
    this.autoLogin();    
  }

  get user() {
    return this._user.asObservable();
  }

  signup(username: string, password: string) {
    return this.http.put<AuthResponseData>(environment.apiUrl + '/auth/signup', {
      username: username,
      password: password
    }, this.config.httpOptions)
      .pipe(
        tap(result => {
          if (result && result.token) {
            this.handleLogin(username, result.token, result.userId);
          }
        }),
        catchError(err => this.handleError(err))
      )
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponseData>(environment.apiUrl + '/auth/login', {
      username: username,
      password: password
    }, this.config.httpOptions)
      .pipe(
        tap(result => {
          if (result && result.token) {
            this.handleLogin(username, result.token, result.userId);
          }
        }),
        catchError(err => this.handleError(err))
      )
  }

  logout = () => {
    this._user.next(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
  }

  autoLogin() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expiryDate = localStorage.getItem('expiryDate');

    if (token && expiryDate) {
      if (new Date(expiryDate) > new Date()) {
        const remainingMilliseconds =
          new Date(expiryDate).getTime() - new Date().getTime();

        const user: User = {
          username,
          token,
          userId,
          expiryDate: new Date(expiryDate)
        }

        this.autoLogout(remainingMilliseconds);
        this._user.next(user);
      } else {
        this.logout();
      }
    }
  }

  autoLogout = (milliseconds: number) => {
    setTimeout(() => {
      this.logout();
    }, milliseconds);
  }

  private handleLogin(username: string, token: string, userId: string) {
    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(
      new Date().getTime() + remainingMilliseconds
    );

    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiryDate', expiryDate.toISOString());
    const user: User = {
      username,
      userId,
      token,
      expiryDate
  };

    this.autoLogout(remainingMilliseconds);
    this._user.next(user);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
