import { Injectable } from '@angular/core';
import { Flight, FlightJournal } from '../model/flight.model';
import { Observable } from 'rxjs';

@Injectable()
export abstract class FlightService {
  getFlightHistory() {
    throw new Error('Method not implemented.');
  }
  abstract getflights(): Observable<Flight[]>;

  //Nuevo método para obtener el historial del dashboard
  abstract getFlights(): Observable<FlightJournal[]>;
}

