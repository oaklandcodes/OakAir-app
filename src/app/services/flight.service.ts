import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../model/flight.model';
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4000/flights'; // URL de tu backend

  // Método para obtener todos los vuelos
  getflights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }
}