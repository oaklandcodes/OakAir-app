import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../model/flight.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './booking.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flightService = inject(FlightService);

  flight = signal<Flight | null>(null);
  isLoading = signal(true);

  destinationImages: Record<string, string> = {
    ORY: 'https://picsum.photos/seed/paris/1200/600',
    FCO: '/roma.jpeg',
    AMS: 'https://picsum.photos/seed/amsterdam/1200/600',
    LGW: '/london.webp',
    CDG: 'https://picsum.photos/seed/cdgparis/1200/600',
    LIS: 'https://picsum.photos/seed/lisbon/1200/600',
    BRU: 'https://picsum.photos/seed/brussels/1200/600',
    DUB: 'https://picsum.photos/seed/dublin/1200/600',
    ZRH: 'https://picsum.photos/seed/zurich/1200/600',
    BER: 'https://picsum.photos/seed/berlinbrandenburg/1200/600',
  };

  defaultImage = 'https://picsum.photos/seed/flight/1200/600';

  getFormattedDate(dateStr: string | Date): string {
    if (!dateStr) return '—';
    let day: string, month: string, year: string;

    if (typeof dateStr === 'string') {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        year = parts[0];
        month = parts[1];
        day = parts[2].split('T')[0];
      } else {
        return String(dateStr);
      }
    } else if (dateStr instanceof Date) {
      day = String(dateStr.getDate()).padStart(2, '0');
      month = String(dateStr.getMonth() + 1).padStart(2, '0');
      year = String(dateStr.getFullYear());
    } else {
      return String(dateStr);
    }

    return `${day}/${month}/${year}`;
  }

  getFormattedTime(dateStr: string): string {
    return '09:30';
  }

  getCityName(code: string): string {
    const cities: { [key: string]: string } = {
      BCN: 'Barcelona',
      ORY: 'París Orly',
      FCO: 'Roma Fiumicino',
      AMS: 'Ámsterdam',
      LGW: 'Londres Gatwick',
      CDG: 'París Charles de Gaulle',
      LIS: 'Lisboa',
      BRU: 'Bruselas',
      DUB: 'Dublín',
      ZRH: 'Zúrich',
      BER: 'Berlín',
    };
    return cities[code] || code;
  }

  getDestinationImage(code: string): string {
    return this.destinationImages[code] || this.defaultImage;
  }

  goBack() {
    this.router.navigate(['/flights']);
  }

  confirmBooking() {
    const currentFlight = this.flight();
    if (currentFlight) {
      alert(`¡Reserva confirmada!\n\nVuelo ${currentFlight.id}\n${this.getCityName(currentFlight.origin)} → ${this.getCityName(currentFlight.destination)}\nFecha: ${currentFlight.date}\nPrecio: €${currentFlight.price}`);
      this.router.navigate(['/flights']);
    }
  }

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id');
    this.flightService.getflights().subscribe((flights) => {
      const found = flights.find((f) => f.id === flightId);
      this.flight.set(found || null);
      this.isLoading.set(false);
    });
  }
}
