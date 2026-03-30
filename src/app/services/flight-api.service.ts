import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Flight } from '../model/flight.model';
import { FlightService } from './flight.service';

@Injectable()
export class ApiFlightService extends FlightService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}${environment.apiFlightsPath}`;

  getflights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }
}
