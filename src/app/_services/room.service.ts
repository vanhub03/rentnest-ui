import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../env';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getLatestRooms(): Observable<any> {
    return this.http.get(enviroment.apiUrl + '/public/latest-room');
  }
}
