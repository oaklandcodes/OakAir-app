import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Flight, FlightJournal } from '../model/flight.model';
import { FlightService } from './flight.service';

const FLIGHTS_STORAGE_KEY = 'local-flights';

const DEFAULT_FLIGHTS: Flight[] = [
  { id: 'VY1001', origin: 'BCN', destination: 'ORY', price: 49.99, date: '2026-04-02' },
  { id: 'VY2142', origin: 'BCN', destination: 'FCO', price: 62.5, date: '2026-04-02' },
  { id: 'VY3988', origin: 'BCN', destination: 'AMS', price: 78.0, date: '2026-04-03' },
  { id: 'VY1512', origin: 'BCN', destination: 'LGW', price: 91.2, date: '2026-04-03' },
  { id: 'VY8430', origin: 'BCN', destination: 'CDG', price: 58.95, date: '2026-04-04' },
  { id: 'VY6201', origin: 'BCN', destination: 'LIS', price: 54.0, date: '2026-04-04' },
  { id: 'VY2994', origin: 'BCN', destination: 'BRU', price: 69.99, date: '2026-04-05' },
  { id: 'VY4455', origin: 'BCN', destination: 'DUB', price: 72.3, date: '2026-04-05' },
  { id: 'VY7822', origin: 'BCN', destination: 'ZRH', price: 83.5, date: '2026-04-06' },
  { id: 'VY9900', origin: 'BCN', destination: 'BER', price: 76.8, date: '2026-04-06' },
];

@Injectable()
export class LocalFlightService extends FlightService {
  constructor() {
    super();
    this.initializeFlightsIfNeeded();
  }

  getflights(): Observable<Flight[]> {
    return of(this.getFlightsFromStorage()).pipe(delay(150));
  }

  getFlights(): Observable<FlightJournal[]> {
    // Datos simulados para historial local
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
    return of(journal).pipe(delay(150));
  }

  private initializeFlightsIfNeeded(): void {
    const existing = this.getStorageItem(FLIGHTS_STORAGE_KEY);
    if (existing) return;
    this.setStorageItem(FLIGHTS_STORAGE_KEY, JSON.stringify(DEFAULT_FLIGHTS));
  }

  private getFlightsFromStorage(): Flight[] {
    const raw = this.getStorageItem(FLIGHTS_STORAGE_KEY);
    if (!raw) return [...DEFAULT_FLIGHTS];

    try {
      const parsed = JSON.parse(raw) as Flight[];
      return Array.isArray(parsed) ? parsed : [...DEFAULT_FLIGHTS];
    } catch {
      return [...DEFAULT_FLIGHTS];
    }
  }

  private getStorageItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  }
}
