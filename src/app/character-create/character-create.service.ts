import { Injectable } from '@angular/core';
import { Class } from '../shared/interfaces/class';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreateService {
  private portraits: string[];
  private classes: Class[];

  constructor(private http: HttpClient) { }

  getPortraits(): Observable<string[]> {
    if (this.portraits) {
      return of(this.portraits);
    } else {
      return this.http.get<string[]>('./assets/data/portraits.json').pipe(
        tap(data => {
          if (data) {
            this.portraits = data;
            return this.portraits;  
          }
        })
      );
    }
  }

  getClasses(): Observable<Class[]> {
    if (this.classes) {
      return of(this.classes);
    } else {
      return this.http.get<Class[]>('./assets/data/classes.json').pipe(
        tap(data => {
          if (data) {
            this.classes = data;
            return this.classes;  
          }
        })
      );
    }
  }
}
