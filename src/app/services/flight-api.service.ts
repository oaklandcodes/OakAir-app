import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Flight, FlightJournal } from '../model/flight.model';
import { FlightService } from './flight.service';

@Injectable()
export class ApiFlightService extends FlightService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}${environment.apiFlightsPath}`;

  getflights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  getFlights(): Observable<FlightJournal[]> {
    // Ejemplo de datos simulados, reemplaza por llamada real si tienes endpoint
    const journal: FlightJournal[] = [
      {
        dest: 'Santorini, Grecia',
        date: '12 Sep, 2024',
        aircraft: 'Gulfstream G650ER',
        status: 'COMPLETED',
      },
      {
        dest: 'Roma, Italia',
        date: '28 Ago, 2024',
        aircraft: 'Bombardier Global 7500',
        status: 'COMPLETED',
      },
      {
        dest: 'Kyoto, Japón',
        date: '05 Jul, 2024',
        aircraft: 'Falcon 8X',
        status: 'COMPLETED',
      },
    ];
    return new Observable<FlightJournal[]>(observer => {
      observer.next(journal);
      observer.complete();
    });
  }
}
