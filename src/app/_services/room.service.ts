import { enviroment } from './../../env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getLatestRooms(): Observable<any> {
    return this.http.get(enviroment.apiUrl + '/public/latest-rooms');
  }

  getAvailableLocations(): Observable<string[]> {
    return this.http.get<string[]>(enviroment.apiUrl + '/public/locations');
  }

  getLandlordRooms(params: any): Observable<any> {
    return this.http.get(enviroment.apiUrl + '/landlord/rooms', { params });
  }
}
