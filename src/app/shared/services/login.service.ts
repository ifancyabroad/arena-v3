import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private config: Config) { }

  signup(username: string, password: string) {
    return this.http.put('http://localhost:3000/auth/signup', {
      username: username,
      password: password
    }, this.config.httpOptions)
      .pipe(
        tap(result => console.log(result)),
        catchError(err => this.handleError(err))
      )
  }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/auth/login', {
      username: username,
      password: password
    }, this.config.httpOptions)
      .pipe(
        tap(result => console.log(result)),
        catchError(err => this.handleError(err))
      )
  }

  handleError(error: HttpErrorResponse) {
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
