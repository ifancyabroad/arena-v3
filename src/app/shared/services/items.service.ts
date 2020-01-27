import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../interfaces/item';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  items: Item[];

  constructor(private http: HttpClient) { }

  // Get list of items
  getItems(): Observable<Item[]> {
    if (this.items) {
      return of(this.items);
    } else {
      return this.http.get<Item[]>('./assets/data/items.json').pipe(
        tap(data => {
          if (data) {
            this.items = data;
            return this.items;              
          }
        })
      );
    }
  }
}
