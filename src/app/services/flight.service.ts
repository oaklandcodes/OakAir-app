import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../model/flight.model';
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/flights';

  // Método para obtener todos los vuelos
  getflights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }
}