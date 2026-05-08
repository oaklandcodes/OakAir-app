import { TestBed } from '@angular/core/testing';
import { LocalFlightService } from './flight-local.service';
import { firstValueFrom } from 'rxjs';

describe('LocalFlightService', () => {
  let service: LocalFlightService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocalFlightService],
    });
    service = TestBed.inject(LocalFlightService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getflights', () => {
    it('should return an array of flights', async () => {
      const flights = await firstValueFrom(service.getflights());
      expect(Array.isArray(flights)).toBe(true);
      expect(flights.length).toBeGreaterThan(0);
    });

    it('should return flights with required properties', async () => {
      const flights = await firstValueFrom(service.getflights());
      flights.forEach((flight) => {
        expect(flight.id).toBeTruthy();
        expect(flight.origin).toBeTruthy();
        expect(flight.destination).toBeTruthy();
        expect(flight.price).toBeDefined();
        expect(flight.date).toBeTruthy();
      });
    });

    it('should return flights with BCN as origin', async () => {
      const flights = await firstValueFrom(service.getflights());
      flights.forEach((flight) => {
        expect(flight.origin).toBe('BCN');
      });
    });
  });

  describe('getFlights (journal)', () => {
    it('should return flight journal entries', async () => {
      const journal = await firstValueFrom(service.getFlights());
      expect(Array.isArray(journal)).toBe(true);
      expect(journal.length).toBeGreaterThan(0);
    });

    it('should return journal entries with required properties', async () => {
      const journal = await firstValueFrom(service.getFlights());
      journal.forEach((entry) => {
        expect(entry.dest).toBeTruthy();
        expect(entry.date).toBeTruthy();
        expect(entry.aircraft).toBeTruthy();
        expect(entry.status).toBeTruthy();
      });
    });

    it('should return entries with valid status', async () => {
      const journal = await firstValueFrom(service.getFlights());
      const validStatuses = ['COMPLETED', 'CANCELLED', 'SCHEDULED'];
      journal.forEach((entry) => {
        expect(validStatuses).toContain(entry.status);
      });
    });
  });
});
