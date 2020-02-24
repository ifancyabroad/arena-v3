import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Config } from '../config';
import { tap, catchError, take, switchMap, map } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';
import { Player } from '../classes/player';
import { LoginService } from './login.service';

export interface Score {
  name: string;
  portrait: string;
  class: string;
  level: number;
  kills: number;
  slainBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  constructor(
    private http: HttpClient,
    private config: Config,
    private loginService: LoginService
  ) { }

  getScores(): Observable<Score[]> {
    return this.loginService.user.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          return of(null);
        }
        const httpOptions = this.config.httpOptions;
        httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + currentUser.token);
        return this.http.get(environment.apiUrl + '/scores/scores', httpOptions)
      }),
      map(result => {
        if (result && result.scores) {
          return result.scores.map(score => {
            return {
              name: score.name,
              portrait: score.portrait,
              class: score.class,
              level: score.level,
              kills: score.kills,
              slainBy: score.slainBy
            } as Score
          });
        }
      }),
      catchError(err => this.handleError(err))
    )
  }

  postScore(player: Player, slainBy: string) {
    return this.loginService.user.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          return of(null);
        }
        const httpOptions = this.config.httpOptions;
        httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + currentUser.token);
        return this.http.post(environment.apiUrl + '/scores/score', {
          name: player.name,
          portrait: player.portrait,
          class: player.cl.name,
          level: player.level,
          kills: player.kills,
          slainBy: slainBy
        }, httpOptions)
      }),    
      tap(result => console.log(result)),
      catchError(err => this.handleError(err))
    )
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
    return throwError(error.error.message);
  }
}
