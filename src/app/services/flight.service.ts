import { Injectable } from '@angular/core';
import { Flight } from '../model/flight.model';
import { Observable } from 'rxjs';

@Injectable()
export abstract class FlightService {
  abstract getflights(): Observable<Flight[]>;
}