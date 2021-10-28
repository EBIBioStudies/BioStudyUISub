import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Collection {
  accno: string;
  title: string;
}

@Injectable()
export class CollectionsService {
  constructor(private http: HttpClient) {}

  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>('/api/collections');
  }
}
